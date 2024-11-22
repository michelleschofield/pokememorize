import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  StudySet,
  readStudySet,
  readCards,
  FilledCard,
  addScore,
} from '../lib';
import { MemoryGame } from '../components/MemoryGame';
import { Back } from '../components/Back';
import { SectionHead } from '../components/SectionHead';
import { Button } from '../components/Button';
import { Scoreboard } from '../components/Scoreboard';
import { RedMessage } from '../components/RedMessage';
import { LoadingMessage } from '../components/LoadingMessage';
import { BlueLink } from '../components/BlueLink';

export function Memory(): JSX.Element {
  const [studySet, setStudySet] = useState<StudySet>();
  const [cards, setCards] = useState<FilledCard[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const { studySetId } = useParams();

  const gameId = 2;

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
      await addScore({ score, gameId, studySetId: +studySetId });
    } catch (err) {
      console.error(err);
      alert(err);
    }
  }

  if (isLoading) {
    return <LoadingMessage>Loading Cards...</LoadingMessage>;
  }

  if (!studySet || !cards || !studySetId) {
    return (
      <div>
        <RedMessage>There was an Error</RedMessage>
        <BlueLink to="/">Return to Home Page</BlueLink>
      </div>
    );
  }

  return (
    <>
      <Back to="/memory">Change Study Set</Back>
      <div>
        <SectionHead />
        <h1 className="text-3xl">Memory Game</h1>
        <h2 className="text-2xl">Study Set: {studySet.title}</h2>
        {!isPlaying && (
          <>
            {!cards.length && (
              <RedMessage>
                You cannot play this game because there are no cards in this set
              </RedMessage>
            )}
            <Button disabled={!cards.length} onClick={() => setIsPlaying(true)}>
              Play Memory Game
            </Button>
            <Scoreboard studySetId={+studySetId} gameId={gameId} />
          </>
        )}
        {isPlaying && (
          <MemoryGame
            onStopPlaying={() => setIsPlaying(false)}
            onWin={handleWin}
            cards={cards}
          />
        )}
      </div>
    </>
  );
}
