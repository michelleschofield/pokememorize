import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export function SectionHead({ children }: Props) {
  return <h2 className="border-t-2 border-slate-600 text-2xl">{children}</h2>;
}
