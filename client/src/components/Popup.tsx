import { ReactNode } from 'react';
import { createPortal } from 'react-dom';

type Props = {
  isOpen: boolean;
  children: ReactNode;
  positionTo: HTMLElement | null;
  onClose: () => void;
};

export function Popup({
  isOpen,
  children,
  positionTo,
  onClose,
}: Props): JSX.Element {
  const rectangle = positionTo?.getBoundingClientRect();
  const top = rectangle ? rectangle.top + rectangle.height : '50%';
  const left = rectangle ? rectangle.left : '50%';

  return (
    <>
      {isOpen &&
        createPortal(
          <>
            <div
              onClick={onClose}
              className="fixed top-0 left-0 right-0 bottom-0 "></div>
            <div style={{ top, left }} className="absolute w-24">
              {children}
            </div>
          </>,
          document.body
        )}
    </>
  );
}
