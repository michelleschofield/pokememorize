import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
};

export function Button({ onClick, children, disabled }: Props): JSX.Element {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="align-middle text-center border rounded py-1 px-3 bg-blue-600 text-white">
      {children}
    </button>
  );
}
