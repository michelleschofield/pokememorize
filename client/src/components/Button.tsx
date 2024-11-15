import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  onClick?: () => void;
};

export function Button({ onClick, children }: Props): JSX.Element {
  return (
    <button
      onClick={onClick}
      className="align-middle text-center border rounded py-1 px-3 bg-blue-600 text-white">
      {children}
    </button>
  );
}
