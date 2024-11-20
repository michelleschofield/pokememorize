import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { StudySet, FilledCard, readStudySet, readCards } from '../lib';
import { FlippingCard } from '../components/FlippingCard';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { PokemonCard } from '../components/PokemonCard';
import { BackOfCard } from '../components/BackOfCard';
import { Indicators } from '../components/Indicators';
import { Back } from '../components/Back';
import { LoadingMessage } from '../components/LoadingMessage';

export function Flashcards(): JSX.Element {
  const [studySet, setStudySet] = useState<StudySet>();
  const [cards, setCards] = useState<FilledCard[]>();
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { studySetId } = useParams();

  useEffect(() => {
    async function load(): Promise<void> {
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

  if (isLoading) {
    return <LoadingMessage>Loading Cards...</LoadingMessage>;
  }

  if (!studySet || !cards) {
    return <div>There was an Error</div>;
  }

  const card = cards[index];

  return (
    <>
      <Back to="/flashcards">Change Study Set</Back>
      <h1 className="text-3xl">FlashCards</h1>
      <h2 className="text-2xl">Study Set: {studySet.title}</h2>
      {!!cards.length && (
        <div className="max-w-96">
          <div className="flex justify-evenly items-center max-w-md">
            <div className="cursor-pointer rounded-lg hover:bg-slate-200">
              <FaChevronLeft className="m-1" onClick={decrementIndex} />
            </div>
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
            <div className="cursor-pointer rounded-lg hover:bg-slate-200">
              <FaChevronRight className="m-1" onClick={incrementIndex} />
            </div>
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
      )}
      {!cards.length && (
        <p>
          There are no cards in this study set, please select a different one
        </p>
      )}
    </>
  );
}
