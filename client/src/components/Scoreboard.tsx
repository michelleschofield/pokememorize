import { useEffect, useState } from 'react';
import { readScores, Score } from '../lib';
import { ScoreDisplayItem } from './ScoreDisplayItem';

type Props = {
  gameId: number;
  studySetId: number;
};

export function Scoreboard({ gameId, studySetId }: Props): JSX.Element {
  const [ownScores, setOwnScores] = useState<Score[]>();
  const [allScores, setAllScores] = useState<Score[]>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadScores(): Promise<void> {
      try {
        const ownScores = await readScores(gameId, studySetId);
        const allScores = await readScores(gameId, studySetId, true);
        setOwnScores(ownScores);
        setAllScores(allScores);
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
      {ownScores && (
        <ul>
          {ownScores.map((score) => (
            <ScoreDisplayItem score={score} key={score.scoreId} />
          ))}
        </ul>
      )}
      <div>All Scores</div>
      {allScores && (
        <ul>
          {allScores.map((score) => (
            <ScoreDisplayItem showName score={score} key={score.scoreId} />
          ))}
        </ul>
      )}
    </>
  );
}
