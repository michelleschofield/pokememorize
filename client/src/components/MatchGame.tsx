import { useCallback, useEffect, useState } from 'react';
import { FilledCard } from '../lib';
import { BackOfCard } from './BackOfCard';
import { Button } from './Button';
import { PokemonCard } from './PokemonCard';

type Props = {
  cards: FilledCard[];
  onWin: (score: number) => void;
  onStopPlaying: () => void;
};

type GameCard = FilledCard & {
  side: 'front' | 'back';
  className: string;
};

export function MatchGame({ cards, onWin, onStopPlaying }: Props): JSX.Element {
  const [selected, setSelected] = useState<GameCard>();
  const [gameCards, setGameCards] = useState<GameCard[]>([]);
  const [score, setScore] = useState(0);

  const shuffle = useCallback((cards: GameCard[]): GameCard[] => {
    return cards.toSorted(() => Math.random() - 0.5);
  }, []);

  const convertCards = useCallback((cards: FilledCard[]): GameCard[] => {
    const gameCards: GameCard[] = [];

    cards.forEach((card) => {
      const withoutSide = {
        ...card,
        className: '',
      };
      gameCards.push({ ...withoutSide, side: 'front' });
      gameCards.push({ ...withoutSide, side: 'back' });
    });

    return gameCards;
  }, []);

  useEffect(() => {
    setGameCards(shuffle(convertCards(cards)));
  }, [cards, shuffle, convertCards]);

  function handleSelect(card: GameCard): void {
    if (!selected) {
      setSelected(card);
      return;
    }

    if (selected.cardId === card.cardId && selected.side !== card.side) {
      const filtered = gameCards.filter(
        (gameCard) => card.cardId !== gameCard.cardId
      );
      const updatedScore = score + 1;
      setGameCards(filtered);
      setSelected(undefined);
      setScore(updatedScore);
      if (!filtered.length) onWin(updatedScore);
      return;
    } else {
      setScore(score - 1);
      setSelected(undefined);
    }
  }

  function restartGame(): void {
    setGameCards(shuffle(convertCards(cards)));
    setScore(0);
  }

  return (
    <>
      <p>Score: {score}</p>
      <div className="flex flex-wrap rounded shadow-inner shadow-stone-600 bg-slate-300 m-2">
        {gameCards.length
          ? gameCards.map((card) => (
              <div
                key={card.cardId + card.side}
                className={`m-2 match cursor-pointer ${
                  card.cardId === selected?.cardId &&
                  card.side === selected.side
                    ? 'selected'
                    : ''
                }`}>
                {card.side === 'front' ? (
                  <PokemonCard
                    onClick={() => handleSelect(card)}
                    caption={card.pokemonName}
                    imageSrc={card.pokemonImageUrl}
                  />
                ) : (
                  <BackOfCard onClick={() => handleSelect(card)} card={card} />
                )}
              </div>
            ))
          : null}

        {!gameCards.length && (
          <div className="m-2 w-full">
            <div>You matched all the cards!!</div>
            <Button onClick={restartGame}>Play Again?</Button>
            <Button onClick={onStopPlaying}>Stop Playing</Button>
          </div>
        )}
      </div>
    </>
  );
}
