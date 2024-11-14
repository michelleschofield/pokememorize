import { StudySetSelector } from '../components/StudySetSelector';

export function FlashcardsSelect() {
  return (
    <>
      <h1 className="text-3xl">Flashcards!</h1>
      <p>Select a set to study</p>
      <StudySetSelector linkTo="/flashcards/" />
    </>
  );
}
