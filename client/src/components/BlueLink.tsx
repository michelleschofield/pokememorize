import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type Props = {
  children: ReactNode;
  to: string;
};

export function BlueLink({ to, children }: Props): JSX.Element {
  return (
    <Link
      to={to}
      className="text-blue-600 underline-offset-2 underline text-2xl">
      {children}
    </Link>
  );
}
