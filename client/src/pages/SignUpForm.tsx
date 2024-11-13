import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../components/useUser';
import { UserData } from '../components/UserContext';

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useUser();
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
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
    <div className="container px-2">
      <h2 className="text-xl font-bold">Sign Up</h2>
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
        <button
          disabled={isLoading}
          className="align-middle text-center border rounded py-1 px-3 bg-blue-600 text-white">
          Register
        </button>
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
