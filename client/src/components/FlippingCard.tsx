import { ReactNode } from 'react';

type Props = {
  frontSide: JSX.Element;
  backSide: ReactNode;
  isFlipped?: boolean;
  onFlip?: () => void;
};

export function FlippingCard({
  frontSide,
  backSide,
  onFlip,
  isFlipped,
}: Props): JSX.Element {
  function flipCard(): void {
    if (onFlip) {
      onFlip();
    }
  }

  return (
    <div
      className={`flip-card ${isFlipped}`}
      // style={{ display: 'inline-block' }}
      onClick={flipCard}>
      <div className="flip-card-inner">
        <div className="flip-card-front">{frontSide}</div>
        <div className="flip-card-back">{backSide}</div>
      </div>
    </div>
  );
}
