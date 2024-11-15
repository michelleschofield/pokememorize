import { Card } from './Card';

export function PokeballCard(): JSX.Element {
  return (
    <Card className="pokeball">
      <div className="red-half"></div>
      <div className="mid-section">
        <div className="mid-stripe"></div>
        <div className="center-circle"></div>
        <div className="mid-stripe"></div>
      </div>
      <div className="white-half"></div>
    </Card>
  );
}
