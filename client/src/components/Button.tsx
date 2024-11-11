import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  onClick: () => void;
};

export function Button({ onClick, children }: Props) {
  return (
    <button onClick={onClick} className="p-1 border-2 rounded border-black">
      {children}
    </button>
  );
}
