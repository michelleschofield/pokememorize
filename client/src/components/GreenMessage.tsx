import { ReactNode } from 'react';
import { FaRegCircleCheck } from 'react-icons/fa6';

type Props = {
  children: ReactNode;
};

export function GreenMessage({ children }: Props): JSX.Element {
  return (
    <div className="border border-green-500 bg-green-50 rounded px-2 flex items-center">
      <FaRegCircleCheck className="text-green-500" />
      <p className="mx-2">{children}</p>
    </div>
  );
}
