import { Link } from 'react-router-dom';
import { PokeballCard } from './PokeballCard';

export function NewCard() {
  return (
    <Link to="/cards/new" className="flex">
      <PokeballCard />
      <h4>Make a new card</h4>
    </Link>
  );
}
