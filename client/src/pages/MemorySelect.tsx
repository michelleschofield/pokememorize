import { StudySetSelector } from '../components/StudySetSelector';

export function MemorySelect(): JSX.Element {
  return (
    <>
      <h1 className="text-3xl">Memory Game!</h1>
      <p>Select a set to study</p>
      <StudySetSelector linkTo="/memory/" />
    </>
  );
}
