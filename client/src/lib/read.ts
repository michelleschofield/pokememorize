import { StudySet, FilledCard, CardDB, Score } from './data';
import { fillOutCards, fillOutCard } from './pokemon-data';
import { readToken } from './user-management';

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
  const json = await response.json();
  if (!response.ok) throw new Error(`fetch error ${json.error}`);
  const sets = json as StudySet[];
  return sets;
}

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
  const json = await response.json();
  if (!response.ok) throw new Error(`fetch error ${json.error}`);
  const studySet = await json;
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
  const json = await response.json();
  if (!response.ok) throw new Error(`fetch error ${json.error}`);
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
  const json = await response.json();
  if (!response.ok) throw new Error(`fetch error ${json.error}`);
  const card = (await response.json()) as CardDB;
  return fillOutCard(card);
}

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

export async function usernameAvailable(username: string): Promise<boolean> {
  const req = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${readToken()}`,
    },
    body: JSON.stringify({ username }),
  };
  const response = await fetch('/api/auth/username-available', req);
  const json = await response.json();
  if (!response.ok) throw new Error(`fetch error ${json.error}`);
  return json.available;
}
