import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  StudySet,
  readStudySet,
  readCards,
  FilledCard,
  addScore,
} from '../lib';
import { MemoryGame } from '../components/MemoryGame';

export function Memory(): JSX.Element {
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

  async function handleWin(score: number): Promise<void> {
    try {
      if (!studySetId) throw new Error('there is no studySetId');
      await addScore({ score, gameId: 2, studySetId: +studySetId });
    } catch (err) {
      console.error(err);
      alert(err);
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
      <MemoryGame onWin={handleWin} cards={cards} />
    </>
  );
}
