import { FaRegCircleCheck } from 'react-icons/fa6';
import { RedMessage } from './RedMessage';
import { LoadingMessage } from './LoadingMessage';

type Props = {
  available: boolean;
  checking: boolean;
};

export function AvailabilityMessage({
  available,
  checking,
}: Props): JSX.Element {
  if (checking) {
    return <LoadingMessage>Checking availability...</LoadingMessage>;
  }

  if (available) {
    return (
      <div className="border border-green-500 bg-green-50 rounded px-2 flex items-center">
        <FaRegCircleCheck className="text-green-500" />
        <p className="mx-2">Username is available</p>
      </div>
    );
  }

  return <RedMessage>Username is not available</RedMessage>;
}
