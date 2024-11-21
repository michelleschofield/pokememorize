import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../components/useUser';
import { UserData } from '../components/UserContext';
import { usernameExists } from '../lib';
import { AvailabilityMessage } from '../components/AvailabilityMessage';
import { Button } from '../components/Button';
import { LoadingMessage } from '../components/LoadingMessage';
import { TextInput } from '../components/TextInput';
import { BlueLink } from '../components/BlueLink';

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
        const available = !(await usernameExists(username));
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
              <TextInput
                value={username}
                onChange={(e) => setUsername(e.currentTarget.value)}
                required
                name="username"
                type="text"
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
              <TextInput required name="password" type="password" />
            </label>
          </div>
        </div>
        <Button disabled={isLoading || isChecking || !isAvailable || !username}>
          Register
        </Button>
      </form>
      <p>
        Already have an account? <BlueLink to="/sign-in">Sign In</BlueLink>
      </p>
      <p>
        Can't be bothered?{' '}
        <BlueLink
          onClick={() => signIn({ username: 'Guest', password: 'guest' })}
          to="/">
          Continue as Guest
        </BlueLink>
      </p>
    </div>
  );
}
