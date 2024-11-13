import { User } from '../components/UserContext';

const authKey = 'um.auth';

type Auth = {
  user: User;
  token: string;
};

export type StudySet = {
  title: string;
  studySetId: number;
};

type CardDB = {
  cardId: number;
  pokemonId: number;
  endpoint: string;
  infoKey: 'types' | 'flavor_text_entries' | 'evolves_from_species';
  studySetId: number;
};

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

export type NewSet = {
  title: string;
};

export type FilledCard = NewCard & {
  cardId: number;
};

export function isFilledCard(
  card: FilledCard | NewCard | undefined
): card is FilledCard {
  return (card as FilledCard)?.cardId !== undefined;
}

export function saveAuth(user: User, token: string): void {
  const auth: Auth = { user, token };
  localStorage.setItem(authKey, JSON.stringify(auth));
}

export function removeAuth(): void {
  localStorage.removeItem(authKey);
}

export function readUser(): User | undefined {
  const auth = localStorage.getItem(authKey);
  if (!auth) return undefined;
  return (JSON.parse(auth) as Auth).user;
}

export function readToken(): string | undefined {
  const auth = localStorage.getItem(authKey);
  if (!auth) return undefined;
  return (JSON.parse(auth) as Auth).token;
}

export async function readStudySets(): Promise<StudySet[]> {
  const req = {
    headers: {
      Authorization: `Bearer ${readToken()}`,
    },
  };
  const response = await fetch('/api/sets', req);
  if (!response.ok) throw new Error(`fetch error status: ${response.status}`);
  const sets = (await response.json()) as StudySet[];
  return sets;
}

export async function readStudySet(studySetId: number): Promise<StudySet> {
  const req = {
    headers: {
      Authorization: `Bearer ${readToken()}`,
    },
  };
  const response = await fetch(`/api/sets/${studySetId}`, req);
  if (!response.ok) throw new Error(`fetch error status: ${response.status}`);
  const studySet = await response.json();
  return studySet;
}

export async function readCards(studySetId: number): Promise<FilledCard[]> {
  const req = {
    headers: {
      Authorization: `Bearer ${readToken()}`,
    },
  };

  const response = await fetch(`/api/cards/${studySetId}`, req);
  if (!response.ok) throw new Error(`fetch error status: ${response.status}`);
  const cards = (await response.json()) as CardDB[];

  return fillOutCards(cards);
}

export async function readCard(cardId: number): Promise<FilledCard> {
  const req = {
    headers: {
      Authorization: `Bearer ${readToken()}`,
    },
  };

  const response = await fetch(`/api/card/${cardId}`, req);
  if (!response.ok) throw new Error(`fetch error status: ${response.status}`);
  const card = (await response.json()) as CardDB;
  return fillOutCard(card);
}

export async function addCard(card: NewCard): Promise<void> {
  try {
    const dbCard = {
      infoKey: card.infoType,
      studySetId: card.studySetId,
      pokemonId: card.pokemonId,
      endpoint: 'pokemon',
    };
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${readToken()}`,
      },
      body: JSON.stringify(dbCard),
    };
    const response = await fetch('/api/cards', req);
    if (!response.ok) throw new Error(`fetch error status: ${response.status}`);
  } catch (err) {
    console.error(err);
    alert(err);
  }
}

export async function addSet(set: NewSet): Promise<StudySet> {
  const dbSet = {
    ...set,
    userId: readUser()?.userId,
  };
  const req = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${readToken()}`,
    },
    body: JSON.stringify(dbSet),
  };
  const response = await fetch('/api/sets', req);
  if (!response.ok) throw new Error(`fetch error status: ${response.status}`);
  const newSet = (await response.json()) as StudySet;
  return newSet;
}

export async function updateSet({
  studySetId,
  title,
}: StudySet): Promise<StudySet> {
  const req = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${readToken()}`,
    },
    body: JSON.stringify({ title }),
  };

  const response = await fetch(`/api/sets/${studySetId}`, req);
  if (!response.ok) throw new Error(`fetch error status: ${response.status}`);
  const updatedSet = await response.json();
  return updatedSet;
}

export async function updateCard(card: FilledCard): Promise<void> {
  try {
    const dbCard = {
      infoKey: card.infoType,
      studySetId: card.studySetId,
      pokemonId: card.pokemonId,
      endpoint: 'pokemon',
    };

    const req = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${readToken()}`,
      },
      body: JSON.stringify(dbCard),
    };

    const response = await fetch(`/api/cards/${card.cardId}`, req);
    if (!response.ok) throw new Error(`fetch error status: ${response.status}`);
  } catch (err) {
    console.error(err);
    alert(err);
  }
}

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

async function fillOutCard(card: CardDB): Promise<FilledCard> {
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

async function fillOutCards(cards: CardDB[]): Promise<FilledCard[]> {
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
