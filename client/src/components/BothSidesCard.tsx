import { Link } from 'react-router-dom';
import { FilledCard } from '../lib';
import { PokemonCard } from './PokemonCard';
import { BackOfCard } from './BackOfCard';

type Props = {
  card: FilledCard;
};

export function BothSidesCard({ card }: Props): JSX.Element {
  return (
    <Link to={`${card.cardId}`} className="flex">
      <PokemonCard imageSrc={card.pokemonImageUrl} caption={card.pokemonName} />
      <BackOfCard card={card} />
    </Link>
  );
}
