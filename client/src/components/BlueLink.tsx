import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type Props = {
  onClick?: () => void;
  children: ReactNode;
  to: string;
};

export function BlueLink({ onClick, to, children }: Props): JSX.Element {
  return (
    <Link
      onClick={onClick}
      to={to}
      className="text-blue-600 underline-offset-2 underline">
      {children}
    </Link>
  );
}
