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

export function isFilledCard(
  card: FilledCard | NewCard | undefined
): card is FilledCard {
  return (card as FilledCard)?.cardId !== undefined;
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
