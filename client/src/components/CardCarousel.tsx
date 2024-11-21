import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { BackOfCard } from './BackOfCard';
import { FlippingCard } from './FlippingCard';
import { Indicators } from './Indicators';
import { PokemonCard } from './PokemonCard';
import { FilledCard } from '../lib';
import { useState } from 'react';

type Props = {
  cards: FilledCard[];
};

export function CardCarousel({ cards }: Props): JSX.Element {
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  function incrementIndex(): void {
    if (!cards) throw new Error("cards don't exist");
    setIndex((index + 1) % cards.length);
    setIsFlipped(false);
  }

  function decrementIndex(): void {
    if (!cards) throw new Error('cards dont exist');
    setIndex((index - 1 + cards.length) % cards.length);
    setIsFlipped(false);
  }

  const card = cards[index];

  return (
    <div className="max-w-96">
      <div className="flex justify-evenly items-center max-w-md">
        <button
          onClick={decrementIndex}
          className="m-1 rounded-lg hover:bg-slate-200">
          <FaChevronLeft />
        </button>
        <FlippingCard
          className="cursor-pointer"
          isFlipped={isFlipped}
          onFlip={() => setIsFlipped(!isFlipped)}
          frontSide={
            <PokemonCard
              imageSrc={card.pokemonImageUrl}
              caption={card.pokemonName}
            />
          }
          backSide={<BackOfCard card={card} />}
        />
        <button
          onClick={incrementIndex}
          className="m-1 rounded-lg hover:bg-slate-200">
          <FaChevronRight />
        </button>
      </div>
      <Indicators
        items={cards}
        current={index}
        onClick={(index) => {
          setIndex(index);
          setIsFlipped(false);
        }}
      />
    </div>
  );
}
