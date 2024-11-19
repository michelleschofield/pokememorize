import { Score } from '../lib';

type Props = {
  score: Score;
  showName?: boolean;
};

export function ScoreDisplayItem({ score, showName }: Props): JSX.Element {
  return (
    <li className="flex justify-between max-w-24  px-2 score">
      <p>{score.score}</p>
      {showName && <p>{score.username}</p>}
    </li>
  );
}
