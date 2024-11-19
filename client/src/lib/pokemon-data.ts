import {
  CardDB,
  FilledCard,
  InfoKey,
  NewCard,
  Pokemon,
  PokemonSpecies,
} from './data';

/**
 * Send a fetch request to the pokeapi pokemon endpoint
 * @param idOrName
 * @returns A promise that resolves to the pokeapi json for the pokemon
 * @throws an error if the response is not ok
 */
async function getPokemon(idOrName: number | string): Promise<Pokemon> {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${idOrName}/`
  );
  if (!response.ok) throw new Error(`fetch error status: ${response.status}`);
  const pokemon = (await response.json()) as Pokemon;
  return pokemon;
}

/**
 * Send a fetch request to the pokeapi pokemon species endpoint
 * @param idOrName
 * @returns A promise that resolves to the pokeapi json for the pokemon
 * @throws an error if response is not ok
 */
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

/**
 * Figure out which endpoint needs to be fetched and make the fetch call
 * @param idOrName the id or name for the pokemon who's info you want to get
 * @param infoKey the key for the information you want to get
 * @returns A promise that resolves to the pokeapi json that contains the infoKey
 * @throws an error if the response from pokeapi is not ok
 */
async function getRightEndpoint(
  idOrName: number | string,
  infoKey: InfoKey
): Promise<Pokemon | PokemonSpecies> {
  let pokemon: Pokemon | PokemonSpecies;
  switch (infoKey) {
    case 'types':
      pokemon = await getPokemon(idOrName);
      break;
    case 'evolves_from_species':
    case 'flavor_text_entries':
      pokemon = await getPokemonSpecies(idOrName);
      break;
  }
  return pokemon;
}

/**
 * Make a copy of card populated with the information for the pokemon
 * @param card provides studySetId and cardId if cardId is provided
 * @param pokemonName the pokemon
 * @param infoKey the information type to fill the card with
 * @returns A promise that resolves to a new card populated with the information (infoKey) for the pokemon (pokemonName)
 * @throws an error if the response to the fetch call is not ok
 */
export async function fillCardViaName(
  card: NewCard | FilledCard,
  pokemonName: string,
  infoKey: InfoKey
): Promise<NewCard | FilledCard> {
  const formattedName = pokemonName.toLocaleLowerCase();
  const pokemon = await getRightEndpoint(formattedName, infoKey);
  const newCard: NewCard = {
    ...card,
    pokemonId: pokemon.id,
    pokemonName: pokemon.name,
    pokemonImageUrl: pokemonImgUrl(pokemon.id),
    infoKey,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- I know this works!
    info: (pokemon as any)[infoKey],
  };
  return newCard;
}

/**
 * Populate a card from the database with information from the pokeapi
 * @param card a card retrieved from the database
 * @returns a new card populated with the information from the pokeapi
 * @throws an error if the response from pokeapi is not ok
 */
export async function fillOutCard(card: CardDB): Promise<FilledCard> {
  const { cardId, pokemonId, infoKey, studySetId } = card;
  const pokemon = await getRightEndpoint(pokemonId, infoKey);
  const filledCard: FilledCard = {
    studySetId,
    cardId,
    pokemonId,
    pokemonName: pokemon.name,
    pokemonImageUrl: pokemonImgUrl(pokemonId),
    infoKey: infoKey,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- I know this works!
    info: (pokemon as any)[infoKey],
  };
  return filledCard;
}

/**
 * Call fillOutCard on every card in array
 * @param cards an array of cards from the database
 * @returns a new array of cards that have been populated with information from pokeapi
 * @throws if the pokeapi response is at any point not ok
 */
export async function fillOutCards(cards: CardDB[]): Promise<FilledCard[]> {
  const newCards: FilledCard[] = [];
  for (let i = 0; i < cards.length; i++) {
    const filledCard = await fillOutCard(cards[i]);
    newCards.push(filledCard);
  }
  return newCards;
}

/**
 *
 * @param pokemonId
 * @returns a url that leads to an image of the pokemon
 */
function pokemonImgUrl(pokemonId: number): string {
  let formattedId = `${pokemonId}`;
  while (formattedId.length < 3) {
    formattedId = '0' + formattedId;
  }
  return `https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/${formattedId}.png`;
}
