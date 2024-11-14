import { Card } from './Card';

type Props = {
  caption: string;
  imageSrc: string;
};

export function PokemonCard({ caption, imageSrc }: Props) {
  return (
    <Card>
      <img src={imageSrc} className="w-full" />
      <h3 className="text-2xl">{caption}</h3>
    </Card>
  );
}
