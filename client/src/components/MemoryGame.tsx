import { useEffect, useState } from 'react';
import { FilledCard } from '../lib';
import { BackOfCard } from './BackOfCard';
import { Button } from './Button';
import { FlippingCard } from './FlippingCard';
import { PokeballCard } from './PokeballCard';
import { PokemonCard } from './PokemonCard';

type CardSide = FilledCard & {
  side: 'front' | 'back';
};

type Props = {
  cards: FilledCard[];
  onWin: (score: number) => void;
};

export function MemoryGame({ cards, onWin }: Props): JSX.Element {
  const [matchedCards, setMatchedCards] = useState<CardSide[]>([]);
  const [selected, setSelected] = useState<CardSide>();
  const [flipped, setFlipped] = useState<CardSide[]>([]);
  const [gameCards, setGameCards] = useState<CardSide[]>([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const cardSides: CardSide[] = [];

    cards.forEach((card) => {
      cardSides.push({ ...card, side: 'front' });
      cardSides.push({ ...card, side: 'back' });
    });

    cardSides.sort(() => Math.random() - 0.5);

    setGameCards(cardSides);
  }, [cards]);

  function handleSelect(card: CardSide): void {
    if (flipped.length) return;
    if (!selected) {
      setSelected(card);
      return;
    }

    if (selected.cardId === card.cardId && selected.side !== card.side) {
      const matches = [...matchedCards, card, selected];
      setMatchedCards(matches);
      setSelected(undefined);
      setScore(score + 3);
      if (matches.length === cards.length) {
        onWin(score + 3);
      }
      return;
    } else {
      setScore(score - 1);
      setFlipped([...flipped, card, selected]);
      setSelected(undefined);
      setTimeout(() => setFlipped(flipped.slice(2)), 1000);
    }
  }

  function shouldBeFlipped(card: CardSide): boolean {
    if (
      flipped.find(
        (cardSide) =>
          cardSide.cardId === card.cardId && cardSide.side === card.side
      )
    ) {
      return true;
    } else if (
      matchedCards.find(
        (cardSide) =>
          cardSide.cardId === card.cardId && cardSide.side === card.side
      )
    ) {
      return true;
    } else if (
      selected?.cardId === card.cardId &&
      selected.side === card.side
    ) {
      return true;
    }
    return false;
  }

  function restartGame(): void {
    setMatchedCards([]);
    setScore(0);
  }

  return (
    <>
      <p>Score: {score}</p>
      <div className="flex flex-wrap rounded shadow-inner shadow-stone-600 bg-slate-300 m-2">
        {gameCards.length === matchedCards.length && (
          <div className="m-2 w-full">
            <div>You matched all the cards!!</div>
            <Button onClick={restartGame}>Play Again?</Button>
          </div>
        )}
        {gameCards.map((card) => (
          <FlippingCard
            key={card.cardId + card.side}
            onFlip={() => handleSelect(card)}
            isFlipped={shouldBeFlipped(card)}
            className={
              matchedCards.find(
                (cardSide) =>
                  cardSide.cardId === card.cardId && cardSide.side === card.side
              )
                ? 'correct m-2'
                : 'm-2'
            }
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
