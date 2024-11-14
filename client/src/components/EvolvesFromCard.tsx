import { FromSpecies } from '../lib';
import { Card } from './Card';

type Props = {
  info: FromSpecies;
};

export function EvolvesFromCard({ info }: Props) {
  return (
    <Card className="text-center">
      <p className="text-2xl">Evolves From</p>
      <h4 className="text-2xl">{info?.name ?? 'no pokemon'}</h4>
    </Card>
  );
}
