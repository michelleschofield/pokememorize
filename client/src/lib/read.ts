import { StudySet, FilledCard, CardDB } from './data';
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
