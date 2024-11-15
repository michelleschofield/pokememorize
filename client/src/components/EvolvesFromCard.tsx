import { FromSpecies } from '../lib';
import { Card } from './Card';

type Props = {
  info: FromSpecies;
  onClick?: () => void;
};

export function EvolvesFromCard({ info, onClick }: Props): JSX.Element {
  return (
    <Card onClick={onClick} className="text-center">
      <p className="text-2xl">Evolves From</p>
      <h4 className="text-2xl">{info?.name ?? 'no pokemon'}</h4>
    </Card>
  );
}
