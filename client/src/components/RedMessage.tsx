import { ReactNode } from 'react';
import { FaRegCircleXmark } from 'react-icons/fa6';

type Props = {
  children: ReactNode;
};

export function RedMessage({ children }: Props): JSX.Element {
  return (
    <div className="border border-red-500 bg-red-50 rounded px-2 flex items-center">
      <FaRegCircleXmark className="text-red-500 mr-2" />
      {children}
    </div>
  );
}
