import { FaCircle, FaRegCircle } from 'react-icons/fa';

type Props = {
  onClick: () => void;
  active: boolean;
};

export function IndicatorDot({ onClick, active }: Props): JSX.Element {
  return (
    <button onClick={onClick} className="m-1">
      {active ? <FaCircle /> : <FaRegCircle />}
    </button>
  );
}
