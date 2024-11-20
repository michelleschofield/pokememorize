import { FaSpinner } from 'react-icons/fa';
import { FaRegCircleCheck, FaRegCircleXmark } from 'react-icons/fa6';

type Props = {
  available: boolean;
  checking: boolean;
};

export function AvailabilityMessage({
  available,
  checking,
}: Props): JSX.Element {
  if (checking) {
    return (
      <div className="border border-slate-400 bg-slate-50 rounded px-2 flex items-center">
        <FaSpinner className="spin" />
        <p className="mx-2">Checking availability...</p>
      </div>
    );
  }

  if (available) {
    return (
      <div className="border border-green-500 bg-green-50 rounded px-2 flex items-center">
        <FaRegCircleCheck className="text-green-500" />
        <p className="mx-2">Username is available</p>
      </div>
    );
  }

  return (
    <div className="border border-red-500 bg-red-50 rounded px-2 flex items-center">
      <FaRegCircleXmark className="text-red-500" />
      <p className="mx-2">Username is not available</p>
    </div>
  );
}
