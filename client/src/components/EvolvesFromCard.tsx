import { FromSpecies } from '../lib';
import { Card } from './Card';

type Props = {
  info: FromSpecies;
};

export function EvolvesFromCard({ info }: Props) {
  return (
    <Card>
      <p>Evolves From</p>
      <p>{info?.name ?? 'no pokemon'}</p>
    </Card>
  );
}
