import { StudySetSelector } from '../components/StudySetSelector';

export function AsteroidSelect(): JSX.Element {
  return (
    <>
      <h1 className="text-3xl">Asteroid Game!</h1>
      <p>Select a set to study</p>
      <StudySetSelector linkTo="/asteroid/" />
    </>
  );
}
