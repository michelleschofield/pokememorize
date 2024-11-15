import React, { ReactNode } from 'react';

type Props = {
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  children: ReactNode;
};

export function Card({
  children,
  className,
  style,
  onClick,
}: Props): JSX.Element {
  return (
    <div
      onClick={onClick}
      style={{ ...style, backgroundColor: 'rgb(239, 239, 239)' }}
      className={`flex flex-col justify-center items-center w-36 h-52 p-2 m-2 rounded-md shadow-md shadow-stone-500 ${className}`}>
      {children}
    </div>
  );
}
