import { FilledCard, NewCard } from '../lib';
import { EvolvesFromCard } from './EvolvesFromCard';
import { TextCard } from './TextCard';
import { TypesCard } from './TypesCard';

type Props = {
  card: NewCard | FilledCard;
  onClick?: () => void;
};

export function BackOfCard({ card, onClick }: Props): JSX.Element {
  const { infoKey: infoType, info } = card;

  switch (infoType) {
    case 'types':
      return <TypesCard onClick={onClick} types={info} />;
    case 'flavor_text_entries':
      return (
        <TextCard
          onClick={onClick}
          text={info.find((entry) => entry.language.name === 'en')?.flavor_text}
        />
      );
    case 'evolves_from_species':
      return <EvolvesFromCard onClick={onClick} info={info} />;
  }

  return <div>Back side of card</div>;
}
