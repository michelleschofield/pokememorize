import { Card } from './Card';

type Props = {
  text?: string;
  onClick?: () => void;
};

export function TextCard({ text, onClick }: Props): JSX.Element {
  return (
    <Card className="justify-start" onClick={onClick}>
      <p className="text-left">{text}</p>
    </Card>
  );
}
