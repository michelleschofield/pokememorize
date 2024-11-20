import { ReactNode } from 'react';
import { FaGear } from 'react-icons/fa6';

type Props = {
  children: ReactNode;
};

export function LoadingMessage({ children }: Props): JSX.Element {
  return (
    <div className="border border-slate-400 bg-slate-50 rounded px-2 flex items-center">
      <FaGear className="spin" />
      <p className="mx-2">{children}</p>
    </div>
  );
}
