import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../components/useUser';
import { UserData } from '../components/UserContext';
import { Button } from '../components/Button';
import { LoadingMessage } from '../components/LoadingMessage';
import { TextInput } from '../components/TextInput';
import { RedMessage } from '../components/RedMessage';
import { BlueLink } from '../components/BlueLink';

export function SignInForm(): JSX.Element {
  const { signIn, user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown | Error>();
  const navigate = useNavigate();

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();
    try {
      setError(undefined);
      setIsLoading(true);
      const formData = new FormData(event.currentTarget);
      const userData = Object.fromEntries(formData) as UserData;
      await signIn(userData);
      navigate('/');
    } catch (err) {
      setError(err);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  if (user) {
    navigate('/');
  }

  return (
    <div className="flex flex-col grow">
      <div>
        <h2 className="text-xl font-bold">Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap mb-1">
            <div className="w-1/2">
              <label className="mb-1 block">
                Username: <TextInput required name="username" />
              </label>
              <label className="mb-1 block">
                Password: <TextInput required name="password" type="password" />
              </label>
            </div>
          </div>
          {isLoading && <LoadingMessage>Signing In...</LoadingMessage>}
          {!!error && (
            <RedMessage>
              {error instanceof Error ? error.message : 'There was an error'}
            </RedMessage>
          )}
          <Button disabled={isLoading}>Sign In</Button>
        </form>
      </div>
      <p>
        Don't have an account? <BlueLink to="/sign-up">Sign Up</BlueLink>
      </p>
      <p>
        Can't be bothered?{' '}
        <BlueLink
          onClick={() => signIn({ username: 'Guest', password: 'guest' })}
          to="/">
          Continue as Guest
        </BlueLink>
      </p>
      <div className="grow flex justify-end items-end">
        <img alt="snivy" className="w-56 md:w-96" src="/images/snivy.png" />
      </div>
    </div>
  );
}
