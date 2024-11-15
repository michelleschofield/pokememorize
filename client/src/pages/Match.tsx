import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { StudySet, readStudySet, readCards } from '../lib';
import { PokemonCard } from '../components/PokemonCard';
import { BackOfCard } from '../components/BackOfCard';

export function Match() {
  const [studySet, setStudySet] = useState<StudySet>();
  const [cards, setCards] = useState<JSX.Element[]>();
  const [isLoading, setIsLoading] = useState(true);
  const { studySetId } = useParams();

  useEffect(() => {
    async function load() {
      try {
        if (!studySetId) throw new Error('there is no studySetId');
        const studySet = await readStudySet(+studySetId);
        const cards = await readCards(+studySetId);

        const cardElements: JSX.Element[] = [];
        cards.forEach((card) => {
          cardElements.push(
            <PokemonCard
              caption={card.pokemonName}
              imageSrc={card.pokemonImageUrl}
            />
          );
          cardElements.push(<BackOfCard card={card} />);
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
      <div className="flex flex-wrap rounded shadow-inner shadow-stone-600 bg-slate-300 m-2">
        {cards}
      </div>
    </>
  );
}
