import { BlueLink } from '../components/BlueLink';

export function NotFound(): JSX.Element {
  return (
    <div className="flex flex-wrap items-center">
      <div className="md:w-1/2 text-2xl py-2">
        <p>Sorry, we couldn't find the page you were looking for</p>
        <BlueLink to="/">Go to Home Page</BlueLink>
      </div>
      <img
        className="w-full p-2 md:w-1/2"
        src="https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/054.png"
      />
    </div>
  );
}
