import { StudySet, FilledCard } from './data';
import { readToken } from './user-management';

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
