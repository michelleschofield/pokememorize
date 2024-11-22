import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { StudySet, FilledCard, readStudySet, readCards } from '../lib';
import { Back } from '../components/Back';
import { LoadingMessage } from '../components/LoadingMessage';
import { CardCarousel } from '../components/CardCarousel';
import { BlueLink } from '../components/BlueLink';
import { RedMessage } from '../components/RedMessage';

export function Flashcards(): JSX.Element {
  const [studySet, setStudySet] = useState<StudySet>();
  const [cards, setCards] = useState<FilledCard[]>();
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

  if (isLoading) {
    return <LoadingMessage>Loading Cards...</LoadingMessage>;
  }

  if (!studySet || !cards) {
    return (
      <div>
        <RedMessage>There was an Error</RedMessage>
        <BlueLink to="/">Return to Home Page</BlueLink>
      </div>
    );
  }

  return (
    <div className="grow flex flex-col">
      <Back to="/flashcards">Change Study Set</Back>
      <h1 className="text-3xl">FlashCards</h1>
      <h2 className="text-2xl">Study Set: {studySet.title}</h2>
      {!!cards.length && <CardCarousel cards={cards} />}
      {!cards.length && (
        <p>
          There are no cards in this study set, please select a different one
        </p>
      )}
      <div className="flex flex-col items-end justify-end grow">
        <img src="/images/oddish.png" />
      </div>
    </div>
  );
}
