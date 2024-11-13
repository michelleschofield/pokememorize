import { Outlet, useNavigate } from 'react-router-dom';
import { useUser } from './useUser';
import { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Menu } from './Menu';

export function Header() {
  const [modalOpen, setModalOpen] = useState(false);
  const { user, handleSignOut } = useUser();
  const navigate = useNavigate();

  const menuItems = [
    {
      name: 'Home',
      path: '/',
      iconUrl: '/home.png',
    },
  ];

  return (
    <>
      <div className="bg-blue-300 flex items-center justify-end px-2 h-16">
        <Menu menuItems={menuItems} />
        <div className="w-2/3">
          <img
            className="w-full object-contain"
            src="https://fontmeme.com/permalink/241004/6e99ef9578d90391496b5f4b4459f196.png"
          />
        </div>
        {user && (
          <p
            className="grow text-end underline underline-offset-2"
            onClick={() => setModalOpen(true)}>
            {user.username}
          </p>
        )}
        <Modal onClose={() => setModalOpen(false)} isOpen={modalOpen}>
          <div className="p-2 rounded">
            <p>Signed in as {user?.username}</p>
            <Button
              onClick={() => {
                setModalOpen(false);
                handleSignOut();
                navigate('/');
              }}>
              Sign out
            </Button>
            <Button onClick={() => setModalOpen(false)}>Close</Button>
          </div>
        </Modal>
      </div>
      <Outlet />
    </>
  );
}
