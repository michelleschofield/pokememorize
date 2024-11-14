import { Card } from './Card';

type Props = {
  text?: string;
};

export function TextCard({ text }: Props) {
  return (
    <Card>
      <p>{text}</p>
    </Card>
  );
}
