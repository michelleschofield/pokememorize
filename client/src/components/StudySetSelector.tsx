import { useEffect, useState } from 'react';
import { readSharedSets, readStudySets, StudySet } from '../lib';
import { ArrowLink } from './ArrowLink';
import { SectionHead } from './SectionHead';

type Props = {
  linkTo: string;
};

export function StudySetSelector({ linkTo }: Props): JSX.Element {
  const [studySets, setStudySets] = useState<StudySet[]>();
  const [sharedSets, setSharedSets] = useState<StudySet[]>();
  const [isLoadingOwn, setIsLoadingOwn] = useState(true);
  const [isLoadingShared, setIsLoadingShared] = useState(true);

  useEffect(() => {
    async function loadSets(): Promise<void> {
      try {
        const studySets = await readStudySets();
        const sharedSets = await readSharedSets();
        setStudySets(studySets);
        setSharedSets(sharedSets);
      } catch (err) {
        console.error(err);
        alert(err);
      } finally {
        setIsLoadingOwn(false);
        setIsLoadingShared(false);
      }
    }
    loadSets();
  }, []);

  return (
    <>
      <SectionHead>Your Study Sets</SectionHead>
      {isLoadingOwn && <p>Loading...</p>}
      {!isLoadingOwn &&
        studySets?.map((studySet) => (
          <ArrowLink
            to={linkTo + studySet.studySetId}
            key={studySet.studySetId}>
            {studySet.title}
          </ArrowLink>
        ))}
      <SectionHead>Shared with you</SectionHead>
      {isLoadingShared && <p>Loading...</p>}
      {!isLoadingShared &&
        sharedSets?.map((studySet) => (
          <ArrowLink
            to={linkTo + studySet.studySetId}
            key={studySet.studySetId}>
            {studySet.title}
          </ArrowLink>
        ))}
    </>
  );
}
