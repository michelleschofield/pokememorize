import { Link } from 'react-router-dom';
import { PokeballCard } from './PokeballCard';

export function NewCard() {
  return (
    <Link to="/study-sets/card/new" className="flex items-center">
      <PokeballCard />
      <h4 className="text-3xl text-gray-400">Make a new card</h4>
    </Link>
  );
}
