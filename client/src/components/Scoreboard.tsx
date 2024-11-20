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
  const [onlyOwnScores, setOnlyOwnScores] = useState(false);
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

  if (!ownScores || !allScores) {
    return <div>There was an Error </div>;
  }

  return (
    <>
      <h4 className="text-lg">Scores</h4>
      {!!allScores.length && (
        <label>
          <input
            type="checkbox"
            onChange={() => setOnlyOwnScores(!onlyOwnScores)}
            checked={onlyOwnScores}
          />{' '}
          Show only my scores
        </label>
      )}
      {onlyOwnScores && (
        <>
          <ul>
            {ownScores.map((score) => (
              <ScoreDisplayItem score={score} key={score.scoreId} />
            ))}
          </ul>
          {!ownScores.length && <p>You have not yet played this game</p>}
        </>
      )}
      {!onlyOwnScores && (
        <>
          <ul>
            {allScores.map((score) => (
              <ScoreDisplayItem showName score={score} key={score.scoreId} />
            ))}
          </ul>
          {!allScores.length && (
            <p>There are not yet any scores for this game</p>
          )}
        </>
      )}
    </>
  );
}
