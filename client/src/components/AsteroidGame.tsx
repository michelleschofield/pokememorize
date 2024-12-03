import { useCallback, useEffect, useState } from 'react';
import { FilledCard } from '../lib';
import { Button } from './Button';

type GameCard = FilledCard & {
  className: string;
};

type Props = {
  cards: FilledCard[];
  onWin: (score: number) => void;
  onStopPlaying: () => void;
};

export function AsteroidGame({
  cards,
  onWin,
  onStopPlaying,
}: Props): JSX.Element {
  const [gameCards, setGameCards] = useState<GameCard[]>([]);
  const [score, setScore] = useState(0);
  const [hasWon, setHasWon] = useState(false);

  const shuffle = useCallback((cards: GameCard[]): GameCard[] => {
    return cards.toSorted(() => Math.random() - 0.5);
  }, []);

  useEffect(() => {
    const gameCards: GameCard[] = cards.map((card) => {
      return { ...card, className: '' };
    });

    setGameCards(shuffle(gameCards));
  }, [cards, shuffle]);

  function restartGame(): void {
    const resetCards = gameCards.map((card) => {
      return {
        ...card,
        className: '',
      };
    });
    setGameCards(shuffle(resetCards));
    setHasWon(false);
    setScore(0);
  }

  return (
    <>
      <p>Score: {score}</p>
      <div className="grow flex flex-col rounded shadow-inner shadow-stone-600 bg-slate-300 m-2">
        {hasWon && (
          <div className="m-2 w-full">
            <div>You matched all the cards!!</div>
            <Button onClick={restartGame}>Play Again?</Button>
            <Button onClick={onStopPlaying}>Stop Playing</Button>
          </div>
        )}
        <button onClick={() => onWin(0)}></button>
      </div>
    </>
  );
}
