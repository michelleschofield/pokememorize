import { type FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../components/useUser';
import { UserData } from '../components/UserContext';
import { Button } from '../components/Button';
import { LoadingMessage } from '../components/LoadingMessage';

export function SignInForm(): JSX.Element {
  const { signIn } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();

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
      alert(`Error signing in: ${err}`);
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
              <input
                required
                name="username"
                type="text"
                className="block border border-gray-600 rounded p-2 h-8 w-full mb-2"
              />
            </label>
            <label className="mb-1 block">
              Password
              <input
                required
                name="password"
                type="password"
                className="block border border-gray-600 rounded p-2 h-8 w-full mb-2"
              />
            </label>
          </div>
        </div>
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
