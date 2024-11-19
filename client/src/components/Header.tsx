import { Outlet, useNavigate } from 'react-router-dom';
import { useUser } from './useUser';
import { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Menu } from './Menu';
import { readToken } from '../lib';

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
      iconUrl: '',
    },
    {
      name: 'Flashcards',
      path: '/flashcards',
      iconUrl: '/images/flashcards.svg',
    },
    {
      name: 'Match',
      path: '/match',
      iconUrl: '',
    },
    {
      name: 'Memory',
      path: '/memory',
      iconUrl: '',
    },
  ];

  async function test(): Promise<void> {
    try {
      const req = {
        headers: {
          Authorization: `Bearer ${readToken()}`,
        },
      };
      const response = await fetch('/api/sharing/sets', req);
      const json = await response.json();
      console.log(json);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <button onClick={test}>Test</button>
      <div className="bg-blue-300 flex items-center justify-end px-2 h-16">
        <Menu menuItems={menuItems} />
        <div className="w-2/3 sm:w-2/5 md:w-1/4 xl:w-1/5">
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
      <div className="bg-slate-200 h-full">
        <div className="container px-2 m-auto bg-white border-x-2 border-slate-300 h-full">
          <Outlet />
        </div>
      </div>
    </>
  );
}
