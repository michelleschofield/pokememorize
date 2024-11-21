import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { useUser } from '../components/useUser';
import { ArrowLink } from '../components/ArrowLink';

export function Home(): JSX.Element {
  const { user, handleSignOut, signIn } = useUser();
  const navigate = useNavigate();

  return (
    <div className="h-full">
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
          <div>
            <ArrowLink to="/study-sets">Study Sets</ArrowLink>
            <ArrowLink to="/flashcards">Flashcards</ArrowLink>
            <ArrowLink to="/match">Matching Game</ArrowLink>
            <ArrowLink to="/memory">Memory Game</ArrowLink>
          </div>
        </>
      )}
      <div className="flex flex-col justify-end items-end md:items-center mt-3 h-2/3">
        <img alt="snorlax" src="/snorlax.jpeg" />
      </div>
    </div>
  );
}
