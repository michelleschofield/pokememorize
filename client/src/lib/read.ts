import { StudySet, FilledCard, CardDB, Score } from './data';
import { fillOutCards, fillOutCard } from './pokemon-data';
import { readToken } from './user-management';

/**
 * Retrieve all study sets belonging to the currently logged in user
 * @returns a promise that resolves to an array of all the study sets
 * @throws an error if the response status is not ok
 */
export async function readStudySets(): Promise<StudySet[]> {
  const req = {
    headers: {
      Authorization: `Bearer ${readToken()}`,
    },
  };
  const response = await fetch('/api/sets', req);
  const json = await response.json();
  if (!response.ok) throw new Error(`fetch error ${json.error}`);
  const sets = json as StudySet[];
  return sets;
}

/**
 * Retrieve all study sets that are shared with the currently signed in user
 * @returns a promise that resolves to an array the shared study sets
 * @throws if the response from the server is not ok
 */
export async function readSharedSets(): Promise<StudySet[]> {
  const req = {
    headers: {
      Authorization: `Bearer ${readToken()}`,
    },
  };
  const response = await fetch('/api/sharing/sets', req);
  const json = await response.json();
  if (!response.ok) throw new Error(`fetch error ${json.error}`);
  const sets = json as StudySet[];
  return sets;
}

/**
 * Retrieve the study set with the provided id.
 * The study set has title, studySetId, and userId properties. It does not include the cards
 * @param studySetId the id of the study set to retrieve
 * @returns a promise that resolves to a study set object
 * @throws an error if the response status is not ok
 */
export async function readStudySet(studySetId: number): Promise<StudySet> {
  const req = {
    headers: {
      Authorization: `Bearer ${readToken()}`,
    },
  };
  const response = await fetch(`/api/sets/${studySetId}`, req);
  const json = await response.json();
  if (!response.ok) throw new Error(`fetch error ${json.error}`);
  const studySet = json;
  return studySet;
}

/**
 * Retrieve all cards that belong to a study set and all data for them from pokeapi
 * @param studySetId the id of the study set whose cards to get
 * @returns a promise that resolves to an array of cards that belong to that study set that have been populated with data from pokeapi
 * @throws an error if the response status is not ok from any of the fetch calls
 */
export async function readCards(studySetId: number): Promise<FilledCard[]> {
  const req = {
    headers: {
      Authorization: `Bearer ${readToken()}`,
    },
  };

  const response = await fetch(`/api/cards/${studySetId}`, req);
  const json = await response.json();
  if (!response.ok) throw new Error(`fetch error ${json.error}`);
  const cards = json as CardDB[];

  return fillOutCards(cards);
}

/**
 * Retrieve a card populated with data from pokeapi
 * @param cardId the id of the card to get
 * @returns a promise that resolves to a card that has been populated with data from pokeapi
 * @throws an error if the response status is not ok from any of the fetch calls
 */
export async function readCard(cardId: number): Promise<FilledCard> {
  const req = {
    headers: {
      Authorization: `Bearer ${readToken()}`,
    },
  };

  const response = await fetch(`/api/card/${cardId}`, req);
  const json = await response.json();
  if (!response.ok) throw new Error(`fetch error ${json.error}`);
  const card = json as CardDB;
  return fillOutCard(card);
}

/**
 * Retrieve all scores on a set from the database
 * @returns a promise that resolves to an array of scores
 * @throws if the response from the server is not ok
 */
export async function readScores(
  gameId: number,
  studySetId: number,
  all?: boolean
): Promise<Score[]> {
  const req = {
    headers: {
      Authorization: `Bearer ${readToken()}`,
    },
  };

  const response = await fetch(
    `/api/scores/${gameId}/${studySetId}${all ? '/all' : ''}`,
    req
  );
  const json = await response.json();
  if (!response.ok) throw new Error(`fetch error ${json.error}`);
  return json as Score[];
}

/**
 * Check if a username is in the database
 * @param username the username that may or may not exist
 * @returns a promise that resolves to true if the username is taken, false if not
 */
export async function usernameExists(username: string): Promise<boolean> {
  const req = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${readToken()}`,
    },
    body: JSON.stringify({ username }),
  };
  const response = await fetch('/api/auth/username-exists', req);
  const json = await response.json();
  if (!response.ok) throw new Error(`fetch error ${json.error}`);
  return json.exists;
}
