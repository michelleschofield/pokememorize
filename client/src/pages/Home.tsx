import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { useUser } from '../components/useUser';
import { ArrowLink } from '../components/ArrowLink';

export function Home() {
  const { user, handleSignOut, signIn } = useUser();
  const navigate = useNavigate();
  return (
    <div>
      {!user && (
        <div>
          <Button onClick={() => navigate('/sign-in')}>Sign In</Button>
          <Button onClick={() => navigate('/sign-up')}>Sign Up</Button>
          <Button
            onClick={() => signIn({ username: 'Guest', password: 'guest' })}>
            Continue as guest
          </Button>
        </div>
      )}
      {user && (
        <>
          <div>Signed in as {user.username}</div>
          <Button onClick={handleSignOut}>Sign Out</Button>
          <ArrowLink to="/study-sets">Study Sets</ArrowLink>
          <ArrowLink to="/flashcards">Flashcards</ArrowLink>
        </>
      )}
    </div>
  );
}
