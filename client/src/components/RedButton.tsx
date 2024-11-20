import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
};

export function RedButton({ onClick, children, disabled }: Props): JSX.Element {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="align-middle text-center border rounded py-1 px-3 bg-red-600 text-white disabled:bg-slate-400 active:bg-red-800">
      {children}
    </button>
  );
}
