import { ReactNode, createContext, useEffect, useState } from 'react';
import { readToken, readUser, removeAuth, saveAuth } from '../lib';

export type User = {
  userId: number;
  username: string;
  role: string;
};

export type UserData = {
  username: string;
  password: string;
};

type AuthData = {
  user: User;
  token: string;
};

export type UserContextValues = {
  user: User | undefined;
  token: string | undefined;
  handleSignOut: () => void;
  signIn: (userData: UserData) => void;
};

export const UserContext = createContext<UserContextValues>({
  user: undefined,
  token: undefined,
  handleSignOut: () => undefined,
  signIn: () => undefined,
});

type Props = {
  children: ReactNode;
};
export function UserProvider({ children }: Props): JSX.Element {
  const [user, setUser] = useState<User>();
  const [token, setToken] = useState<string>();

  useEffect(() => {
    setUser(readUser());
    setToken(readToken());
  }, []);

  function handleSignIn(user: User, token: string): void {
    setUser(user);
    setToken(token);
    saveAuth(user, token);
  }

  function handleSignOut(): void {
    setUser(undefined);
    setToken(undefined);
    removeAuth();
  }

  async function signIn(userData: UserData): Promise<void> {
    const req = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    };
    const res = await fetch('/api/auth/sign-in', req);
    const json = await res.json();
    if (!res.ok) {
      throw new Error(`Error ${json.error}`);
    }
    const { user, token } = json as AuthData;
    handleSignIn(user, token);
  }

  const contextValue = { user, token, handleSignOut, signIn };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}
