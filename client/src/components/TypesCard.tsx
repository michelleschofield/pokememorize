import { PokemonType } from '../lib';
import { capitalizeWord } from '../lib/capitalize';

type Props = {
  types: PokemonType[];
};

export function TypesCard({ types }: Props) {
  return (
    <div className="card justify-center">
      {types.map((type) => (
        <p className="text-2xl" key={type.slot}>
          {capitalizeWord(type.type.name)}
        </p>
      ))}
    </div>
  );
}
