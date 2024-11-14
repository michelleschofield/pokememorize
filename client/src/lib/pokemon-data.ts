import { CardDB, FilledCard } from './data';

export type PokemonType = {
  slot: number;
  type: {
    name: string;
  };
};

type FlavorTextEntry = {
  flavor_text: string;
  language: {
    name: string;
  };
};

export type FromSpecies = {
  name: string;
  url: string;
};

type PokemonSpecies = {
  name: string;
  id: number;
  flavor_text_entries: FlavorTextEntry[];
  evolves_from_species: FromSpecies | null;
  evolution_chain: {
    url: string;
  };
};

type Pokemon = {
  id: number;
  name: string;
  types: PokemonType[];
};

type NewCardBase = {
  studySetId: number;
  pokemonId: number;
  pokemonName: string;
  pokemonImageUrl: string;
};

type NewCardTypes = NewCardBase & {
  infoType: 'types';
  info: PokemonType[];
};

type NewCardFlavor = NewCardBase & {
  infoType: 'flavor_text_entries';
  info: FlavorTextEntry[];
};

type NewCardEvolveFrom = NewCardBase & {
  infoType: 'evolves_from_species';
  info: FromSpecies;
};

export type NewCard = NewCardEvolveFrom | NewCardFlavor | NewCardTypes;

export async function fillCardViaName(
  card: NewCard | FilledCard,
  pokemonName: string,
  infoType: 'types' | 'flavor_text_entries' | 'evolves_from_species'
): Promise<NewCard | FilledCard> {
  const formattedName = pokemonName.toLocaleLowerCase();
  let pokemonInfo: Pokemon | PokemonSpecies;
  switch (infoType) {
    case 'types':
      pokemonInfo = await getPokemon(formattedName);
      break;
    case 'evolves_from_species':
    case 'flavor_text_entries':
      pokemonInfo = await getPokemonSpecies(formattedName);
      break;
  }
  const newCard: NewCard = {
    ...card,
    pokemonId: pokemonInfo.id,
    pokemonName: pokemonInfo.name,
    pokemonImageUrl: pokemonImgUrl(pokemonInfo.id),
    infoType,
    info: pokemonInfo[infoType],
  };
  return newCard;
}

async function getPokemon(idOrName: number | string): Promise<Pokemon> {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${idOrName}/`
  );
  if (!response.ok) throw new Error(`fetch error status: ${response.status}`);
  const pokemon = (await response.json()) as Pokemon;
  return pokemon;
}

async function getPokemonSpecies(
  idOrName: number | string
): Promise<PokemonSpecies> {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon-species/${idOrName}/`
  );
  if (!response.ok) throw new Error(`fetch error status: ${response.status}`);
  const pokemonSpecies = (await response.json()) as PokemonSpecies;
  return pokemonSpecies;
}

export async function fillOutCard(card: CardDB): Promise<FilledCard> {
  const { cardId, pokemonId, infoKey, studySetId } = card;
  let pokemonInfo: Pokemon | PokemonSpecies;
  switch (infoKey) {
    case 'types':
      pokemonInfo = await getPokemon(pokemonId);
      break;
    case 'evolves_from_species':
    case 'flavor_text_entries':
      pokemonInfo = await getPokemonSpecies(pokemonId);
      break;
  }
  const filledCard: FilledCard = {
    studySetId,
    cardId,
    pokemonId,
    pokemonName: pokemonInfo.name,
    pokemonImageUrl: pokemonImgUrl(pokemonId),
    infoType: infoKey,
    info: pokemonInfo[infoKey],
  };
  return filledCard;
}

export async function fillOutCards(cards: CardDB[]): Promise<FilledCard[]> {
  const newCards: FilledCard[] = [];
  for (let i = 0; i < cards.length; i++) {
    const filledCard = await fillOutCard(cards[i]);
    newCards.push(filledCard);
  }
  return newCards;
}

function pokemonImgUrl(pokemonId: number): string {
  let formattedId = `${pokemonId}`;
  while (formattedId.length < 3) {
    formattedId = '0' + formattedId;
  }
  return `https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/${formattedId}.png`;
}
