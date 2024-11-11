import { ReactNode, createContext, useEffect, useState } from 'react';
import { readToken, readUser, removeAuth, saveAuth } from '../lib';

export type User = {
  userId: number;
  username: string;
  role: string;
};

type AuthData = {
  user: User;
  token: string;
};

export type UserContextValues = {
  user: User | undefined;
  token: string | undefined;
  handleSignOut: () => void;
  signIn: (formData: FormData) => void;
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
export function UserProvider({ children }: Props) {
  const [user, setUser] = useState<User>();
  const [token, setToken] = useState<string>();

  useEffect(() => {
    setUser(readUser());
    setToken(readToken());
  }, []);

  function handleSignIn(user: User, token: string) {
    setUser(user);
    setToken(token);
    saveAuth(user, token);
  }

  function handleSignOut() {
    setUser(undefined);
    setToken(undefined);
    removeAuth();
  }

  async function signIn(formData: FormData) {
    const userData = Object.fromEntries(formData);
    const req = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    };
    const res = await fetch('/api/auth/sign-in', req);
    if (!res.ok) {
      throw new Error(`fetch Error ${res.status}`);
    }
    const { user, token } = (await res.json()) as AuthData;
    handleSignIn(user, token);
  }

  const contextValue = { user, token, handleSignOut, signIn };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}
