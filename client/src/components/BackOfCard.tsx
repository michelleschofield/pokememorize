import { FilledCard, NewCard } from '../lib';
import { EvolvesFromCard } from './EvolvesFromCard';
import { TextCard } from './TextCard';
import { TypesCard } from './TypesCard';

type Props = {
  card: NewCard | FilledCard;
};

export function BackOfCard({ card }: Props) {
  const { infoKey: infoType, info } = card;

  switch (infoType) {
    case 'types':
      return <TypesCard types={info} />;
    case 'flavor_text_entries':
      return (
        <TextCard
          text={info.find((entry) => entry.language.name === 'en')?.flavor_text}
        />
      );
    case 'evolves_from_species':
      return <EvolvesFromCard info={info} />;
  }

  return <div>Back side of card</div>;
}
