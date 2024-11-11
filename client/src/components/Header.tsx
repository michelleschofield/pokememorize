import { Outlet } from 'react-router-dom';
import { useUser } from './useUser';

export function Header() {
  const { user } = useUser();
  return (
    <>
      <div className="bg-blue-300 flex items-center justify-between">
        <div className="w-2/3">
          <img
            className="w-full object-contain"
            src="https://fontmeme.com/permalink/241004/6e99ef9578d90391496b5f4b4459f196.png"
          />
        </div>
        {user && <div>{user.username}</div>}
      </div>
      <Outlet />
    </>
  );
}
