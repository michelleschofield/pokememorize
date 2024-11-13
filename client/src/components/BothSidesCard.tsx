import { Link } from 'react-router-dom';
import { FilledCard } from '../lib';
import { PokemonCard } from './PokemonCard';
import { TypesCard } from './TypesCard';

type Props = {
  card: FilledCard;
};

export function BothSidesCard({ card }: Props) {
  return (
    <Link to={`${card.cardId}`} className="flex">
      <PokemonCard imageSrc={card.pokemonImageUrl} caption={card.pokemonName} />
      <TypesCard types={card.info} />
    </Link>
  );
}
