import { useEffect, useState } from 'react';
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
};

export function MemoryGame({ cards, onWin }: Props): JSX.Element {
  const [selected, setSelected] = useState<GameCard>();
  const [gameCards, setGameCards] = useState<GameCard[]>([]);
  const [acceptClicks, setAcceptClicks] = useState(true);
  const [score, setScore] = useState(0);
  const [hasWon, setHasWon] = useState(false);

  useEffect(() => {
    const cardSides: GameCard[] = [];

    cards.forEach((card) => {
      const withoutSide = {
        ...card,
        isFlipped: false,
        isMatched: false,
        className: '',
      };
      cardSides.push({ ...withoutSide, side: 'front' });
      cardSides.push({ ...withoutSide, side: 'back' });
    });

    cardSides.sort(() => Math.random() - 0.5);

    setGameCards(cardSides);
  }, [cards]);

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

  function checkForWin(): void {
    if (hasWon || !gameCards.length) return;
    let matchedCards = 0;
    gameCards.forEach((card) => {
      if (card.isMatched) matchedCards++;
    });
    if (matchedCards === gameCards.length) {
      onWin(score);
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
    setScore(score + 3);
    const updated = gameCards.map((gameCard) => {
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
    setGameCards(updated);
    setSelected(undefined);
    return;
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
    setGameCards(
      gameCards.map((card) => {
        return {
          ...card,
          isFlipped: false,
          isMatched: false,
          className: '',
        };
      })
    );
    setHasWon(false);
    setScore(0);
  }

  checkForWin();

  return (
    <>
      <p>Score: {score}</p>
      <div className="flex flex-wrap rounded shadow-inner shadow-stone-600 bg-slate-300 m-2">
        {hasWon && (
          <div className="m-2 w-full">
            <div>You matched all the cards!!</div>
            <Button onClick={restartGame}>Play Again?</Button>
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
