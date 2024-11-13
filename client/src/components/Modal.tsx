import { ReactNode, useEffect, useRef } from 'react';

type Props = {
  isOpen: boolean;
  onClose?: () => void;
  children: ReactNode;
};

export function Modal({ isOpen, onClose, children }: Props) {
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.showModal();
    } else {
      modalRef.current?.close();
    }
  }, [isOpen]);

  return (
    <dialog ref={modalRef} onClose={onClose}>
      {children}
    </dialog>
  );
}
