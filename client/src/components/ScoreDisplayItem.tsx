import { Score } from '../lib';

type Props = {
  score: Score;
};

export function ScoreDisplayItem({ score }: Props): JSX.Element {
  return <li>{score.score}</li>;
}
