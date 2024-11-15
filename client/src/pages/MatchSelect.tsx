import { StudySetSelector } from '../components/StudySetSelector';

export function MatchSelect(): JSX.Element {
  return (
    <>
      <h1 className="text-3xl">Match Game!</h1>
      <p>Select a set to study</p>
      <StudySetSelector linkTo="/match/" />
    </>
  );
}
