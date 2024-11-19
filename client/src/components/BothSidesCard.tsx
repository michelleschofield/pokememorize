import { FilledCard } from '../lib';
import { PokemonCard } from './PokemonCard';
import { BackOfCard } from './BackOfCard';

type Props = {
  card: FilledCard;
};

export function BothSidesCard({ card }: Props): JSX.Element {
  return (
    <div className="flex">
      <PokemonCard imageSrc={card.pokemonImageUrl} caption={card.pokemonName} />
      <BackOfCard card={card} />
    </div>
  );
}
