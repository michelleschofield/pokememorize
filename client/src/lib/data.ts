import { User } from '../components/UserContext';
import { capitalizeWord } from './capitalize';

const authKey = 'um.auth';

type Auth = {
  user: User;
  token: string;
};

export type StudySet = {
  title: string;
  studySetId: number;
};

type CardDB = {
  cardId: number;
  pokemonId: number;
  endpoint: string;
  infoKey: string;
  studySetId: number;
};

export type PokemonType = {
  slot: number;
  type: {
    name: string;
  };
};

type Pokemon = {
  id: number;
  name: string;
  types: PokemonType[];
};

export type NewCard = {
  studySetId: number;
  pokemonId: number;
  pokemonName: string;
  pokemonImageUrl: string;
  infoType: string;
  info: PokemonType[];
};

export type NewSet = {
  title: string;
};

export type FilledCard = NewCard & {
  cardId: number;
};

export function saveAuth(user: User, token: string): void {
  const auth: Auth = { user, token };
  localStorage.setItem(authKey, JSON.stringify(auth));
}

export function removeAuth(): void {
  localStorage.removeItem(authKey);
}

export function readUser(): User | undefined {
  const auth = localStorage.getItem(authKey);
  if (!auth) return undefined;
  return (JSON.parse(auth) as Auth).user;
}

export function readToken(): string | undefined {
  const auth = localStorage.getItem(authKey);
  if (!auth) return undefined;
  return (JSON.parse(auth) as Auth).token;
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

export async function fillCardViaName(
  card: NewCard | FilledCard,
  pokemonName: string,
  infoType: string
): Promise<NewCard | FilledCard> {
  const formattedName = pokemonName.toLocaleLowerCase();
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${formattedName}/`
  );
  if (!response.ok) throw new Error(`fetch error status: ${response.status}`);
  const pokemon = (await response.json()) as Pokemon;
  const newCard: NewCard = {
    ...card,
    pokemonId: pokemon.id,
    pokemonName: pokemon.name,
    pokemonImageUrl: pokemonImgUrl(pokemon.id),
    infoType,
    info: pokemon[infoType],
  };
  return newCard;
}

async function fillOutCard(card: CardDB): Promise<FilledCard> {
  const { cardId, pokemonId, infoKey, endpoint, studySetId } = card;
  const response = await fetch(
    `https://pokeapi.co/api/v2/${endpoint}/${pokemonId}/`
  );
  if (!response.ok) throw new Error(`fetch error status: ${response.status}`);
  const pokemon = (await response.json()) as Pokemon;
  const filledCard: FilledCard = {
    studySetId,
    cardId,
    pokemonId,
    pokemonName: capitalizeWord(pokemon.name),
    pokemonImageUrl: pokemonImgUrl(pokemonId),
    infoType: infoKey,
    info: pokemon[infoKey],
  };
  return filledCard;
}

async function fillOutCards(cards: CardDB[]): Promise<FilledCard[]> {
  const newCards: FilledCard[] = [];
  for (let i = 0; i < cards.length; i++) {
    const filledCard = await fillOutCard(cards[i]);
    newCards.push(filledCard);
  }
  return newCards;
}

function pokemonImgUrl(pokemonId: number): string {
  let formattedId = `${pokemonId}`;
  while (formattedId.length < 3) {
    formattedId = '0' + formattedId;
  }
  return `https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/${formattedId}.png`;
}
