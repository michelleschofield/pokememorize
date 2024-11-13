import { FromSpecies } from '../lib';

type Props = {
  info: FromSpecies;
};

export function EvolvesFromCard({ info }: Props) {
  return (
    <div className="card">
      <p>Evolves From</p>
      <p>{info?.name ?? 'no pokemon'}</p>
    </div>
  );
}
