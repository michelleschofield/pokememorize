import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

type Props = {
  label: string;
  to: string;
};

export function ArrowLink({ label, to }: Props) {
  return (
    <Link
      className="flex items-center text-2xl w-full justify-end hover:bg-gradient-to-l from-slate-300 transition-all ease-in-out duration-1000"
      to={to}>
      <h3>{label}</h3>
      <FaArrowRight className="m-2" size="25" />
    </Link>
  );
}
