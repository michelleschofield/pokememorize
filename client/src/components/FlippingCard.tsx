import { ReactNode } from 'react';

type Props = {
  frontSide: JSX.Element;
  backSide: ReactNode;
  isFlipped: boolean;
  className?: string;
  onFlip?: () => void;
};

export function FlippingCard({
  frontSide,
  backSide,
  onFlip,
  isFlipped,
  className,
}: Props): JSX.Element {
  function flipCard(): void {
    if (onFlip) {
      onFlip();
    }
  }

  return (
    <button
      className={`flip-card rounded ${isFlipped} ${className}`}
      onClick={flipCard}>
      <div className="flip-card-inner">
        <div className="flip-card-front">{frontSide}</div>
        <div className="flip-card-back">{backSide}</div>
      </div>
    </button>
  );
}
