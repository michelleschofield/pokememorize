import { Outlet } from 'react-router-dom';
import { useUser } from './useUser';
import { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';

export function Header() {
  const [modalOpen, setModalOpen] = useState(false);
  const { user, handleSignOut } = useUser();

  return (
    <>
      <div className="bg-blue-300 flex items-center justify-between px-2">
        <div className="w-2/3">
          <img
            className="w-full object-contain"
            src="https://fontmeme.com/permalink/241004/6e99ef9578d90391496b5f4b4459f196.png"
          />
        </div>
        {user && <p onClick={() => setModalOpen(true)}>{user.username}</p>}
        <Modal onClose={() => setModalOpen(false)} isOpen={modalOpen}>
          <Button
            onClick={() => {
              setModalOpen(false);
              handleSignOut();
            }}>
            Sign out
          </Button>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
        </Modal>
      </div>
      <Outlet />
    </>
  );
}
