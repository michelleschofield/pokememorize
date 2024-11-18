import { useCallback, useEffect, useState } from 'react';
import { FilledCard } from '../lib';
import { BackOfCard } from './BackOfCard';
import { Button } from './Button';
import { FlippingCard } from './FlippingCard';
import { PokeballCard } from './PokeballCard';
import { PokemonCard } from './PokemonCard';

type GameCard = FilledCard & {
  side: 'front' | 'back';
  isFlipped: boolean;
  isMatched: boolean;
  className: string;
};

type Props = {
  cards: FilledCard[];
  onWin: (score: number) => void;
  onStopPlaying: () => void;
};

export function MemoryGame({
  cards,
  onWin,
  onStopPlaying,
}: Props): JSX.Element {
  const [selected, setSelected] = useState<GameCard>();
  const [gameCards, setGameCards] = useState<GameCard[]>([]);
  const [acceptClicks, setAcceptClicks] = useState(true);
  const [score, setScore] = useState(0);
  const [hasWon, setHasWon] = useState(false);

  const shuffle = useCallback((cards: GameCard[]): GameCard[] => {
    return cards.toSorted(() => Math.random() - 0.5);
  }, []);

  useEffect(() => {
    const gameCards: GameCard[] = [];

    cards.forEach((card) => {
      const withoutSide = {
        ...card,
        isFlipped: false,
        isMatched: false,
        className: '',
      };
      gameCards.push({ ...withoutSide, side: 'front' });
      gameCards.push({ ...withoutSide, side: 'back' });
    });

    setGameCards(shuffle(gameCards));
  }, [cards, shuffle]);

  function handleSelect(card: GameCard): void {
    if (!acceptClicks) return;
    if (card.isFlipped) return;
    if (!selected) {
      selectCard(card);
      return;
    }

    if (selected.cardId === card.cardId && selected.side !== card.side) {
      makeMatch(card.cardId);
    } else {
      markIncorrect(selected, card);
      setTimeout(unflipIncorrect, 1500);
      setScore(score - 1);
      setSelected(undefined);
    }
  }

  function checkForWin(cards: GameCard[], finalScore: number): void {
    if (hasWon || !gameCards.length) return;
    let matchedCards = 0;
    cards.forEach((card) => {
      if (card.isMatched) matchedCards++;
    });
    if (matchedCards === cards.length) {
      onWin(finalScore);
      setHasWon(true);
    }
  }

  function markIncorrect(card1: GameCard, card2: GameCard): void {
    const updated = gameCards.map((gameCard) => {
      if (
        (gameCard.cardId === card1.cardId && gameCard.side === card1.side) ||
        (gameCard.cardId === card2.cardId && gameCard.side === card2.side)
      ) {
        return {
          ...gameCard,
          isFlipped: true,
          className: 'incorrect',
        };
      }
      return gameCard;
    });
    setAcceptClicks(false);
    setGameCards(updated);
  }

  function makeMatch(cardId: number): void {
    const updatedScore = score + 3;
    setScore(updatedScore);
    const updatedCards = gameCards.map((gameCard) => {
      if (gameCard.cardId === cardId) {
        return {
          ...gameCard,
          isFlipped: true,
          isMatched: true,
          className: 'correct',
        };
      }
      return gameCard;
    });
    setGameCards(updatedCards);
    setSelected(undefined);
    checkForWin(updatedCards, updatedScore);
  }

  function selectCard(card: GameCard): void {
    setSelected(card);
    const updated = gameCards.map((gameCard) => {
      if (gameCard.cardId === card.cardId && gameCard.side === card.side) {
        return {
          ...gameCard,
          isFlipped: true,
        };
      }
      return gameCard;
    });
    setGameCards(updated);
  }

  function unflipIncorrect(): void {
    setGameCards(
      gameCards.map((card) => {
        if (card.isFlipped && !card.isMatched) {
          return {
            ...card,
            isFlipped: false,
            className: '',
          };
        }
        return card;
      })
    );
    setAcceptClicks(true);
  }

  function restartGame(): void {
    const resetCards = gameCards.map((card) => {
      return {
        ...card,
        isFlipped: false,
        isMatched: false,
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
      <div className="flex flex-wrap rounded shadow-inner shadow-stone-600 bg-slate-300 m-2">
        {hasWon && (
          <div className="m-2 w-full">
            <div>You matched all the cards!!</div>
            <Button onClick={restartGame}>Play Again?</Button>
            <Button onClick={onStopPlaying}>Stop Playing</Button>
          </div>
        )}
        {gameCards.map((card) => (
          <FlippingCard
            key={card.cardId + card.side}
            onFlip={() => handleSelect(card)}
            isFlipped={card.isFlipped}
            className={`${card.className} ${
              acceptClicks && !card.isFlipped ? 'cursor-pointer' : ''
            } m-2`}
            frontSide={<PokeballCard />}
            backSide={
              card.side === 'front' ? (
                <PokemonCard
                  caption={card.pokemonName}
                  imageSrc={card.pokemonImageUrl}
                />
              ) : (
                <BackOfCard card={card} />
              )
            }
          />
        ))}
      </div>
    </>
  );
}
