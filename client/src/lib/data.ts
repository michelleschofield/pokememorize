export type StudySet = {
  title: string;
  studySetId: number;
};

export type CardDB = {
  cardId: number;
  pokemonId: number;
  endpoint: string;
  infoKey: 'types' | 'flavor_text_entries' | 'evolves_from_species';
  studySetId: number;
};

export type NewSet = {
  title: string;
};

export type FilledCard = NewCard & {
  cardId: number;
};

export type Score = {
  studySetId: number;
  gameId: number;
  username?: string;
  score: number;
  scoreId?: number;
};

export type PokemonType = {
  slot: number;
  type: {
    name: string;
  };
};

export type FlavorTextEntry = {
  flavor_text: string;
  language: {
    name: string;
  };
};

export type FromSpecies = {
  name: string;
  url: string;
};

export type InfoKey = 'types' | 'flavor_text_entries' | 'evolves_from_species';

export type PokemonSpecies = {
  name: string;
  id: number;
  flavor_text_entries: FlavorTextEntry[];
  evolves_from_species: FromSpecies | null;
  evolution_chain: {
    url: string;
  };
};

export type Pokemon = {
  id: number;
  name: string;
  types: PokemonType[];
};

export type NewCardBase = {
  studySetId: number;
  pokemonId: number;
  pokemonName: string;
  pokemonImageUrl: string;
};

export type NewCardTypes = NewCardBase & {
  infoKey: 'types';
  info: PokemonType[];
};

export type NewCardFlavor = NewCardBase & {
  infoKey: 'flavor_text_entries';
  info: FlavorTextEntry[];
};

export type NewCardEvolveFrom = NewCardBase & {
  infoKey: 'evolves_from_species';
  info: FromSpecies;
};

export type NewCard = NewCardEvolveFrom | NewCardFlavor | NewCardTypes;

/**
 * Check if a card is a FilledCard or not
 * @param card that will checked to see if it is a filled card
 * @returns a boolean indicating if the provided card is filled
 * @returns false if card is undefined
 */
export function isFilledCard(
  card: FilledCard | NewCard | undefined
): card is FilledCard {
  return (card as FilledCard)?.cardId !== undefined;
}
