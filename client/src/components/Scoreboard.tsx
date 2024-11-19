import { useEffect, useState } from 'react';
import { readScores, Score } from '../lib';
import { ScoreDisplayItem } from './ScoreDisplayItem';

type Props = {
  gameId: number;
  studySetId: number;
};

export function Scoreboard({ gameId, studySetId }: Props): JSX.Element {
  const [scores, setScores] = useState<Score[]>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadScores(): Promise<void> {
      try {
        const scores = await readScores(gameId, studySetId);
        setScores(scores);
      } catch (err) {
        console.error(err);
        alert(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadScores();
  }, [gameId, studySetId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div>Your Scores</div>
      {scores && (
        <ul>
          {scores.map((score) => (
            <ScoreDisplayItem score={score} key={score.scoreId} />
          ))}
        </ul>
      )}
    </>
  );
}
