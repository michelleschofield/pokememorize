import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <>
      <div>Sorry, we couldn't find the page you were looking for</div>
      <Link to="/" className="text-blue-600 underline-offset-2 underline">
        Go to Home Page
      </Link>
    </>
  );
}
