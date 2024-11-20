import { ReactNode } from 'react';
import { FaCircleNotch } from 'react-icons/fa';

type Props = {
  children: ReactNode;
};

export function LoadingMessage({ children }: Props): JSX.Element {
  return (
    <div className="border border-slate-400 bg-slate-50 rounded px-2 flex items-center">
      <FaCircleNotch className="spin" />
      <p className="mx-2">{children}</p>
    </div>
  );
}
