import { User } from '../components/UserContext';

type Auth = {
  user: User;
  token: string;
};

const authKey = 'um.auth';

export function saveAuth(user: User, token: string): void {
  const auth: Auth = { user, token };
  localStorage.setItem(authKey, JSON.stringify(auth));
}

export function removeAuth(): void {
  localStorage.removeItem(authKey);
}

/**
 * Read the user from local storage
 * @returns the user
 * @returns undefined if there is no auth in local storage
 */
export function readUser(): User | undefined {
  const auth = localStorage.getItem(authKey);
  if (!auth) return undefined;
  return (JSON.parse(auth) as Auth).user;
}

/**
 * Read the authorization token from local storage
 * @returns the token
 * @returns undefined if there is no auth in local storage
 */
export function readToken(): string | undefined {
  const auth = localStorage.getItem(authKey);
  if (!auth) return undefined;
  return (JSON.parse(auth) as Auth).token;
}
