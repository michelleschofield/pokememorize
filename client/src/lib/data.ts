import { User } from '../components/UserContext';

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
};

type PokemonType = {
  name: string;
};

type Pokemon = {
  name: string;
  types: PokemonType[];
};

export type FilledCard = {
  cardId: number;
  pokemonId: number;
  pokemonName: string;
  pokemonImageUrl: string;
  infoType: string;
  info: PokemonType;
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

async function fillOutCards(cards: CardDB[]): Promise<FilledCard[]> {
  const newCards: FilledCard[] = [];
  for (let i = 0; i < cards.length; i++) {
    const { cardId, pokemonId, infoKey, endpoint } = cards[i];
    const response = await fetch(
      `https://pokeapi.co/api/v2/${endpoint}/${pokemonId}/`
    );
    if (!response.ok) throw new Error(`fetch error status: ${response.status}`);
    const pokemon = (await response.json()) as Pokemon;
    const filledCard: FilledCard = {
      cardId,
      pokemonId,
      pokemonName: pokemon.name,
      pokemonImageUrl: pokemonImgUrl(pokemonId),
      infoType: infoKey,
      info: pokemon[infoKey],
    };
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
