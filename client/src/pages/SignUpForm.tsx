import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../components/useUser';
import { UserData } from '../components/UserContext';
import { usernameAvailable } from '../lib';
import { AvailabilityMessage } from '../components/AvailabilityMessage';
import { Button } from '../components/Button';
import { LoadingMessage } from '../components/LoadingMessage';

export function SignUpForm(): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState(false);
  const { signIn } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    async function checkUsername(): Promise<void> {
      try {
        setIsChecking(true);
        const available = await usernameAvailable(username);
        setIsAvailable(available);
      } catch (err) {
        console.error(err);
        alert(err);
      } finally {
        setIsChecking(false);
      }
    }
    const timeoutId = setTimeout(checkUsername, 500);
    return (): void => clearTimeout(timeoutId);
  }, [username]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData(event.currentTarget);
      const userData = Object.fromEntries(formData) as UserData;
      const req = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      };
      const res = await fetch('/api/auth/sign-up', req);
      if (!res.ok) {
        throw new Error(`fetch Error ${res.status}`);
      }
      await signIn(userData);
      navigate('/');
    } catch (err) {
      alert(`Error registering user: ${err}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold">Sign Up</h2>
      {isLoading && <LoadingMessage>Signing up...</LoadingMessage>}
      <form onSubmit={handleSubmit}>
        <div className="flex flex-wrap mb-1">
          <div className="w-1/2">
            <label className="mb-1 block">
              Username
              <input
                value={username}
                onChange={(e) => setUsername(e.currentTarget.value)}
                required
                name="username"
                type="text"
                className="block border border-gray-600 rounded p-2 h-8 w-full mb-2"
              />
            </label>
            {username && (
              <AvailabilityMessage
                available={isAvailable}
                checking={isChecking}
              />
            )}
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
        <Button disabled={isLoading || isChecking || !isAvailable || !username}>
          Register
        </Button>
      </form>
      <p>
        Already have an account?{' '}
        <Link
          className="text-blue-600 underline underline-offset-2"
          to="/sign-in">
          Sign In
        </Link>
      </p>
    </div>
  );
}
