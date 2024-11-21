import { ReactNode } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

type Props = {
  to: string;
  children: ReactNode;
};

export function Back({ to, children }: Props): JSX.Element {
  return (
    <Link to={to} className="flex items-center">
      <FaArrowLeft />
      <p className="ml-2">{children}</p>
    </Link>
  );
}
