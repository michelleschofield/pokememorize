import { FaCircle, FaRegCircle } from 'react-icons/fa';

type Props = {
  onClick: () => void;
  active: boolean;
};

export function IndicatorDot({ onClick, active }: Props) {
  return (
    <>
      {active ? (
        <FaCircle className="m-1 cursor-pointer" onClick={onClick} />
      ) : (
        <FaRegCircle className="m-1 cursor-pointer" onClick={onClick} />
      )}
    </>
  );
}
