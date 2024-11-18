import { useEffect, useState } from 'react';
import { readScores, Score } from '../lib';

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
      <div>Scoreboard</div>
      {scores &&
        scores.map((score) => <div key={score.scoreId}>{score.score}</div>)}
    </>
  );
}
