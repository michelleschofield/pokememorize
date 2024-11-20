import { ReactNode, useEffect, useRef } from 'react';

type Props = {
  isOpen: boolean;
  onClose?: () => void;
  className?: string;
  children: ReactNode;
};

export function Modal({
  isOpen,
  onClose,
  className,
  children,
}: Props): JSX.Element {
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.showModal();
    } else {
      modalRef.current?.close();
    }
  }, [isOpen]);

  return (
    <dialog className={className} ref={modalRef} onClose={onClose}>
      {children}
    </dialog>
  );
}
