import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { StudySet, FilledCard, readStudySet, readCards } from '../lib';
import { FlippingCard } from '../components/FlippingCard';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { PokemonCard } from '../components/PokemonCard';
import { BackOfCard } from '../components/BackOfCard';
import { Indicators } from '../components/Indicators';

export function Flashcards() {
  const [studySet, setStudySet] = useState<StudySet>();
  const [cards, setCards] = useState<FilledCard[]>();
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { studySetId } = useParams();

  useEffect(() => {
    async function load() {
      try {
        if (!studySetId) throw new Error('there is no studySetId');
        const studySet = await readStudySet(+studySetId);
        const cards = await readCards(+studySetId);

        setStudySet(studySet);
        setCards(cards);
      } catch (err) {
        console.error(err);
        alert(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [studySetId]);

  function incrementIndex() {
    if (!cards) throw new Error("cards don't exist");
    setIndex((index + 1) % cards.length);
    setIsFlipped(false);
  }

  function decrementIndex() {
    if (!cards) throw new Error('cards dont exist');
    setIndex((index - 1 + cards.length) % cards.length);
    setIsFlipped(false);
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!studySet || !cards) {
    return <div>There was an Error</div>;
  }

  const card = cards[index];

  return (
    <>
      <h2 className="text-3xl">{studySet.title}</h2>
      <Link to="/flashcards">Change Study Set</Link>
      <div className="max-w-96">
        <div className="flex justify-evenly items-center max-w-md">
          <FaChevronLeft
            className="cursor-pointer rounded hover:bg-slate-400"
            onClick={decrementIndex}
          />
          <FlippingCard
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
          <FaChevronRight onClick={incrementIndex} />
        </div>
        <Indicators
          items={cards}
          current={index}
          onClick={(index) => setIndex(index)}
        />
      </div>
    </>
  );
}
