import { PokemonType } from '../lib';
import { capitalizeWord } from '../lib/capitalize';
import { Card } from './Card';

type Props = {
  types: PokemonType[];
};

export function TypesCard({ types }: Props) {
  return (
    <Card>
      {types.map((type) => (
        <p className="text-2xl" key={type.slot}>
          {capitalizeWord(type.type.name)}
        </p>
      ))}
    </Card>
  );
}
