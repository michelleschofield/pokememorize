import { fillOutCard, fillOutCards, NewCard } from './pokemon-data';
import { readToken, readUser } from './user-management';

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

type Score = {
  score: number;
  studySetId: number;
  gameId: number;
};

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

/**
 * Retrieve all study sets belonging to the currently logged in user
 * @returns an array of all the study sets
 * @throws an error if the response status is not ok
 */
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

/**
 * Retrieve the study set with the provided id.
 * The study set has title, studySetId, and userId properties. It does not include the cards
 * @param studySetId the id of the study set to retrieve
 * @returns a study set object
 * @throws an error if the response status is not ok
 */
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

/**
 * Retrieve all cards that belong to a study set and all data for them from pokeapi
 * @param studySetId the id of the study set whose cards to get
 * @returns an array of cards that belong to that study set that have been populated with data from pokeapi
 * @throws an error if the response status is not ok from any of the fetch calls
 */
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

/**
 * Retrieve a card populated with data from pokeapi
 * @param cardId the id of the card to get
 * @returns a card that has been populated with data from pokeapi
 * @throws an error if the response status is not ok from any of the fetch calls
 */
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

/**
 * Add a card to the database.
 * @param card the card to add
 * @throws an error if the response from the server is not ok
 */
export async function addCard({
  infoKey,
  studySetId,
  pokemonId,
}: NewCard): Promise<void> {
  const dbCard = {
    infoKey: infoKey,
    studySetId: studySetId,
    pokemonId: pokemonId,
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
}

export async function addScore(score: Score): Promise<void> {
  const req = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${readToken()}`,
    },
    body: JSON.stringify(score),
  };
  const response = await fetch('/api/scores', req);
  if (!response.ok) throw new Error(`fetch error status: ${response.status}`);
}

/**
 * Add a study set to the database
 * @param set the set to add
 * @returns the set after it has been added, it will have a studySetId
 * @throws an error if the response from the server is not ok
 */
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

/**
 * Update a study set in the database
 * @param studySet the study set to update
 * @returns the updated study set
 * @throws an error if the response from the server is not ok
 */
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

/**
 * Update a card in the database
 * @param card the card to update
 * @throws an error if the response from the server is not ok
 */
export async function updateCard(card: FilledCard): Promise<void> {
  const dbCard = {
    infoKey: card.infoKey,
    studySetId: card.studySetId,
    pokemonId: card.pokemonId,
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
}

/**
 * Delete a study set from the database - this will delete all cards that belong to it
 * @param studySetId the id of the set to be deleted
 * @throws an error if the response from the server is not ok
 */
export async function deleteSet(studySetId: number): Promise<void> {
  const req = {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${readToken()}`,
    },
  };

  const response = await fetch(`/api/sets/${studySetId}`, req);
  if (!response.ok) throw new Error(`fetch error status: ${response.status}`);
}

/**
 * Delete a card from the database
 * @param cardId the id of the card to be deleted
 * @throws an error if the response from the server is not ok
 */
export async function deleteCard(cardId: number): Promise<void> {
  const req = {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${readToken()}`,
    },
  };

  const response = await fetch(`/api/cards/${cardId}`, req);
  if (!response.ok) throw new Error(`fetch error status: ${response.status}`);
}
