import { useEffect, useState } from 'react';
import { readStudySets, StudySet } from '../lib';
import { ArrowLink } from './ArrowLink';
import { SectionHead } from './SectionHead';

type Props = {
  linkTo: string;
};

export function StudySetSelector({ linkTo }: Props) {
  const [studySets, setStudySets] = useState<StudySet[]>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSets() {
      try {
        const studySets = await readStudySets();
        setStudySets(studySets);
      } catch (err) {
        console.error(err);
        alert(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadSets();
  }, []);

  return (
    <>
      <SectionHead>Your Study Sets</SectionHead>
      {isLoading && <p>Loading...</p>}
      {!isLoading &&
        studySets?.map((studySet) => (
          <ArrowLink
            to={linkTo + studySet.studySetId}
            key={studySet.studySetId}>
            {studySet.title}
          </ArrowLink>
        ))}
    </>
  );
}
