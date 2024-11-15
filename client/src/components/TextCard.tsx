import { Card } from './Card';

type Props = {
  text?: string;
  onClick?: () => void;
};

export function TextCard({ text, onClick }: Props): JSX.Element {
  return (
    <Card onClick={onClick}>
      <p>{text}</p>
    </Card>
  );
}
