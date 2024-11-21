import { type FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../components/useUser';
import { UserData } from '../components/UserContext';
import { Button } from '../components/Button';
import { LoadingMessage } from '../components/LoadingMessage';
import { TextInput } from '../components/TextInput';
import { RedMessage } from '../components/RedMessage';

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
    <div>
      <h2 className="text-xl font-bold">Sign In</h2>
      {isLoading && <LoadingMessage>Signing In...</LoadingMessage>}
      <form onSubmit={handleSubmit}>
        <div className="flex flex-wrap mb-1">
          <div className="w-1/2">
            <label className="mb-1 block">
              Username
              <TextInput required name="username" type="text" />
            </label>
            <label className="mb-1 block">
              Password
              <TextInput required name="password" type="password" />
            </label>
          </div>
        </div>
        {!!error && (
          <RedMessage>
            {error instanceof Error ? error.message : 'There was an error'}
          </RedMessage>
        )}
        <Button disabled={isLoading}>Sign In</Button>
      </form>
      <p>
        Don't have an account?{' '}
        <Link
          className="text-blue-600 underline underline-offset-2"
          to="/sign-up">
          Sign Up
        </Link>
      </p>
    </div>
  );
}
