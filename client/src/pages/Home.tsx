import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { useUser } from '../components/useUser';

export function Home() {
  const { user, handleSignOut } = useUser();
  const navigate = useNavigate();
  return (
    <>
      {!user && (
        <div>
          <Button onClick={() => navigate('/sign-in')}>Sign In</Button>
          <Button onClick={() => navigate('/sign-up')}>Sign Up</Button>
          <Link to="">Continue as guest</Link>
        </div>
      )}
      {user && (
        <>
          <div>signed in as {user.username}</div>
          <Button onClick={handleSignOut}>Sign Out</Button>
        </>
      )}
    </>
  );
}
