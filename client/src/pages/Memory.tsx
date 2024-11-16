import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  StudySet,
  readStudySet,
  readCards,
  FilledCard,
  addScore,
} from '../lib';
import { PokemonCard } from '../components/PokemonCard';
import { BackOfCard } from '../components/BackOfCard';
import { Button } from '../components/Button';
import { FlippingCard } from '../components/FlippingCard';
import { PokeballCard } from '../components/PokeballCard';

type CardFront = FilledCard & {
  side: 'front';
};

type CardBack = FilledCard & {
  side: 'back';
};

type CardSide = CardBack | CardFront;

export function Memory(): JSX.Element {
  const [studySet, setStudySet] = useState<StudySet>();
  const [allCards, setAllCards] = useState<CardSide[]>();
  const [matchedCards, setMatchedCards] = useState<CardSide[]>([]);
  const [selected, setSelected] = useState<CardSide[]>([]);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { studySetId } = useParams();

  useEffect(() => {
    async function load(): Promise<void> {
      try {
        if (!studySetId) throw new Error('there is no studySetId');
        const studySet = await readStudySet(+studySetId);
        const cards = await readCards(+studySetId);

        const cardSides: CardSide[] = [];

        cards.forEach((card) => {
          cardSides.push({ ...card, side: 'front' });
          cardSides.push({ ...card, side: 'back' });
        });

        cardSides.sort(() => Math.random() - 0.5);

        setStudySet(studySet);
        setAllCards(cardSides);
      } catch (err) {
        console.error(err);
        alert(err);
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [studySetId]);

  function handleSelect(card: CardSide): void {
    console.log('handling select');
    console.log(selected);
    if (!allCards) throw new Error('cards is undefined');
    if (!selected.length) {
      setSelected([card]);
      return;
    }

    if (
      selected.find(
        (cardSide) =>
          cardSide.cardId === card.cardId && cardSide.side !== card.side
      )
    ) {
      const matches = [...selected, ...matchedCards, card];
      setMatchedCards(matches);
      setSelected([]);
      setScore(score + 1);
      if (matches.length === allCards.length) {
        handleWin();
      }
      return;
    } else {
      setScore(score - 1);
      setSelected([]);
    }
  }

  async function handleWin(): Promise<void> {
    try {
      if (!studySetId) throw new Error('there is no studySetId');
      await addScore({ score, gameId: 2, studySetId: +studySetId });
    } catch (err) {
      console.error(err);
      alert(err);
    }
  }

  function restartGame(): void {
    setMatchedCards([]);
    setScore(0);
  }

  function shouldBeFlipped(card: CardSide): boolean {
    if (
      selected.find(
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
    }
    return false;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!studySet || !allCards) {
    return <div>There was an Error</div>;
  }

  return (
    <>
      <h2 className="text-3xl">{studySet.title}</h2>
      <Link to="/match">Change Study Set</Link>
      <p>Score: {score} This game does not work lol</p>
      <div className="flex flex-wrap rounded shadow-inner shadow-stone-600 bg-slate-300 m-2">
        {allCards.length === matchedCards.length && (
          <>
            <div className="m-2">You matched all the cards!!</div>
            <Button onClick={restartGame}>Play Again?</Button>
          </>
        )}
        {allCards.map((card) => (
          <FlippingCard
            key={card.cardId + card.side}
            onFlip={() => handleSelect(card)}
            isFlipped={shouldBeFlipped(card)}
            className="m-2"
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
