import { readToken } from './user-management';

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
  const json = await response.json();
  if (!response.ok) throw new Error(`fetch error ${json.error}`);
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
  const json = await response.json();
  if (!response.ok) throw new Error(`fetch error ${json.error}`);
}
