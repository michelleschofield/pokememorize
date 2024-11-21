import { Outlet, useNavigate } from 'react-router-dom';
import { useUser } from './useUser';
import { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Menu } from './Menu';
import { RedButton } from './RedButton';

export function Header(): JSX.Element {
  const [modalOpen, setModalOpen] = useState(false);
  const { user, handleSignOut } = useUser();
  const navigate = useNavigate();

  const menuItems = [
    {
      name: 'Home',
      path: '/',
      iconUrl: '/home.png',
    },
    {
      name: 'Study Sets',
      path: '/study-sets',
      iconUrl: '/study-sets.png',
    },
    {
      name: 'Flashcards',
      path: '/flashcards',
      iconUrl: '/flashcards.png',
    },
    {
      name: 'Match',
      path: '/match',
      iconUrl: '/match.png',
    },
    {
      name: 'Memory',
      path: '/memory',
      iconUrl: '/memory.png',
    },
  ];

  return (
    <>
      <div className="bg-slate-200 h-full">
        <div className="bg-blue-300 flex items-center justify-end px-2 h-16 container m-auto border-x-2 border-blue-400">
          {user && <Menu menuItems={menuItems} />}
          <div className="w-2/3 sm:w-2/5 md:w-1/3 xl:w-1/5">
            <img
              className="w-full object-contain"
              src="/pokememorize-logo.png"
            />
          </div>
          {user && (
            <p
              className="grow text-end underline underline-offset-2 cursor-pointer"
              onClick={() => setModalOpen(true)}>
              {user.username}
            </p>
          )}
          <Modal onClose={() => setModalOpen(false)} isOpen={modalOpen}>
            <div className="p-2 rounded">
              <p>Signed in as {user?.username}</p>
              <RedButton
                onClick={() => {
                  setModalOpen(false);
                  handleSignOut();
                  navigate('/');
                }}>
                Sign out
              </RedButton>
              <Button onClick={() => setModalOpen(false)}>Close</Button>
            </div>
          </Modal>
        </div>
        <div className="container px-2 m-auto bg-white border-x-2 border-slate-300 h-full">
          <Outlet />
        </div>
      </div>
    </>
  );
}
