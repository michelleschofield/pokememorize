import { ReactNode } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

type Props = {
  to: string;
  children: ReactNode;
};

export function ArrowLink({ to, children }: Props): JSX.Element {
  return (
    <Link
      className="flex items-center text-2xl w-full justify-end hover:bg-gradient-to-l from-slate-300 transition-all ease-in-out duration-1000"
      to={to}>
      <h3>{children}</h3>
      <FaArrowRight className="m-2" size="25" />
    </Link>
  );
}
