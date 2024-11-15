import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { StudySet, readStudySet, readCards, FilledCard } from '../lib';
import { PokemonCard } from '../components/PokemonCard';
import { BackOfCard } from '../components/BackOfCard';
import { Button } from '../components/Button';

type CardFront = FilledCard & {
  side: 'front';
};

type CardBack = FilledCard & {
  side: 'back';
};

type CardSide = CardBack | CardFront;

export function Match(): JSX.Element {
  const [studySet, setStudySet] = useState<StudySet>();
  const [cards, setCards] = useState<CardSide[]>();
  const [selected, setSelected] = useState<{
    cardId: number;
    side: 'front' | 'back';
  }>();
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
        setCards(cardElements);
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
    if (!cards) throw new Error('cards is undefined');
    if (!selected) {
      setSelected({ cardId, side });
      return;
    }

    if (selected.cardId === cardId && selected.side !== side) {
      setCards([...cards.filter((card) => card.cardId !== cardId)]);
      setSelected(undefined);
      setScore(score + 1);
      return;
    } else {
      setScore(score - 1);
      setSelected(undefined);
    }
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!studySet || !cards) {
    return <div>There was an Error</div>;
  }

  return (
    <>
      <h2 className="text-3xl">{studySet.title}</h2>
      <Link to="/match">Change Study Set</Link>
      <p>Score: {score}</p>
      <div className="flex flex-wrap rounded shadow-inner shadow-stone-600 bg-slate-300 m-2">
        {cards.length
          ? cards.map((card) => (
              <div>
                {card.side === 'front' ? (
                  <PokemonCard
                    onClick={() => handleSelect(card.cardId, 'front')}
                    key={card.cardId + card.side}
                    caption={card.pokemonName}
                    imageSrc={card.pokemonImageUrl}
                  />
                ) : (
                  <BackOfCard
                    onClick={() => handleSelect(card.cardId, 'back')}
                    key={card.cardId + card.side}
                    card={card}
                  />
                )}
              </div>
            ))
          : null}

        {!cards.length && (
          <>
            <div className="m-2">You matched all the cards!!</div>
            <Button>Play Again?</Button>
          </>
        )}
      </div>
    </>
  );
}
