import { NewSet, Score, StudySet } from './data';
import { NewCard } from './data';
import { readToken, readUser } from './user-management';

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
  const json = await response.json();
  if (!response.ok) throw new Error(`fetch error: ${json.error}`);
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
