import { Card } from './Card';

type Props = {
  caption: string;
  imageSrc: string;
  onClick?: () => void;
};

export function PokemonCard({
  caption,
  imageSrc,
  onClick,
}: Props): JSX.Element {
  return (
    <Card onClick={onClick}>
      <img alt={caption} src={imageSrc} className="w-full" />
      <h3 className="text-2xl">{caption}</h3>
    </Card>
  );
}
