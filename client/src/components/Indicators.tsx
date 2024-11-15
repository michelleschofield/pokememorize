import { IndicatorDot } from './IndicatorDot';

type Props = {
  items: unknown[];
  current: number;
  onClick: (index: number) => void;
};

export function Indicators({ current, items, onClick }: Props): JSX.Element {
  return (
    <div className="flex justify-center flex-wrap">
      {items.map((_, index) => (
        <IndicatorDot
          key={index}
          onClick={() => onClick(index)}
          active={current === index}
        />
      ))}
    </div>
  );
}
