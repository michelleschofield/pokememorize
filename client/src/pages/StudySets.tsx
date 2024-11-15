import { ArrowLink } from '../components/ArrowLink';
import { StudySetSelector } from '../components/StudySetSelector';

export function StudySets(): JSX.Element {
  return (
    <div>
      <ArrowLink to="/study-sets/new">Make a new set</ArrowLink>
      <StudySetSelector linkTo="/study-sets/" />
    </div>
  );
}
