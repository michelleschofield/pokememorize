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
  const [currentCards, setCurrentCards] = useState<CardSide[]>();
  const [selected, setSelected] = useState<
    {
      cardId: number;
      side: 'front' | 'back';
    }[]
  >([]);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { studySetId } = useParams();

  useEffect(() => {
    async function load(): Promise<void> {
      try {
        if (!studySetId) throw new Error('there is no studySetId');
        const studySet = await readStudySet(+studySetId);
        const cards = await readCards(+studySetId);

        const cardElements: CardSide[] = [];

        cards.forEach((card) => {
          cardElements.push({ ...card, side: 'front' });
          cardElements.push({ ...card, side: 'back' });
        });

        cardElements.sort(() => Math.random() - 0.5);

        setStudySet(studySet);
        setAllCards(cardElements);
        setCurrentCards(cardElements);
      } catch (err) {
        console.error(err);
        alert(err);
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [studySetId]);

  function handleSelect(cardId: number, side: 'front' | 'back'): void {
    if (!currentCards) throw new Error('cards is undefined');
    if (!selected) {
      setSelected([{ cardId, side }]);
      return;
    }

    if (selected[0].cardId === cardId && selected[0].side !== side) {
      const filtered = currentCards.filter((card) => card.cardId !== cardId);
      setCurrentCards(filtered);
      setSelected(undefined);
      setScore(score + 1);
      if (!filtered.length) handleWin();
      return;
    } else {
      setScore(score - 1);
      setSelected(undefined);
    }
  }

  async function handleWin(): Promise<void> {
    try {
      if (!studySetId) throw new Error('there is no studySetId');
      await addScore({ score, gameId: 1, studySetId: +studySetId });
    } catch (err) {
      console.error(err);
      alert(err);
    }
  }

  function restartGame(): void {
    setCurrentCards(allCards);
    setScore(0);
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!studySet || !currentCards) {
    return <div>There was an Error</div>;
  }

  return (
    <>
      <h2 className="text-3xl">{studySet.title}</h2>
      <Link to="/match">Change Study Set</Link>
      <p>Score: {score} This game does not work lol</p>
      <div className="flex flex-wrap rounded shadow-inner shadow-stone-600 bg-slate-300 m-2">
        {currentCards.map((card) => (
          <>
            {card.side === 'front' ? (
              <FlippingCard
                onFlip={() => handleSelect(card.cardId, card.side)}
                isFlipped={
                  card.cardId === selected[0]?.cardId &&
                  card.side === selected[0].side
                }
                className="m-2"
                frontSide={<PokeballCard />}
                backSide={
                  <PokemonCard
                    caption={card.pokemonName}
                    imageSrc={card.pokemonImageUrl}
                  />
                }
              />
            ) : (
              <FlippingCard
                onFlip={() => handleSelect(card.cardId, card.side)}
                isFlipped={
                  card.cardId === selected?.cardId &&
                  card.side === selected.side
                }
                className="m-2"
                frontSide={<PokeballCard />}
                backSide={<BackOfCard card={card} />}
              />
            )}
          </>
        ))}
        {!currentCards.length && (
          <>
            <div className="m-2">You matched all the cards!!</div>
            <Button onClick={restartGame}>Play Again?</Button>
          </>
        )}
      </div>
    </>
  );
}
