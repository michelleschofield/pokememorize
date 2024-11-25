import { Card } from './Card';

type Props = {
  text?: string;
  onClick?: () => void;
};

export function TextCard({ text, onClick }: Props): JSX.Element {
  const formatted = text?.split('\n').join(' ').split('\f').join(' ');
  return (
    <Card onClick={onClick}>
      <p className="text-left">{formatted}</p>
    </Card>
  );
}
