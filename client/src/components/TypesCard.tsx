import { PokemonType } from '../lib';
import { capitalizeWord } from '../lib/capitalize';
import { Card } from './Card';

type Props = {
  types: PokemonType[];
  onClick?: () => void;
};

export function TypesCard({ types, onClick }: Props): JSX.Element {
  return (
    <Card onClick={onClick}>
      {types.map((type) => (
        <p className="text-2xl" key={type.slot}>
          {capitalizeWord(type.type.name)}
        </p>
      ))}
    </Card>
  );
}
