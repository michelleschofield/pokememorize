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
}: Props) {
  function flipCard() {
    if (onFlip) {
      onFlip();
    }
  }

  return (
    <div style={{ display: 'inline-block' }} onClick={flipCard}>
      {!isFlipped && frontSide}
      {isFlipped && backSide}
    </div>
  );
}
