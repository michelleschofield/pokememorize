import { useEffect, useState } from 'react';
import { readSharedSets, readStudySets, StudySet } from '../lib';
import { ArrowLink } from './ArrowLink';
import { SectionHead } from './SectionHead';
import { LoadingMessage } from './LoadingMessage';

type Props = {
  linkTo: string;
  sharedTo?: string;
};

export function StudySetSelector({ linkTo, sharedTo }: Props): JSX.Element {
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
      {isLoadingOwn && <LoadingMessage>Loading study sets...</LoadingMessage>}
      {!isLoadingOwn &&
        studySets?.map((studySet) => (
          <ArrowLink
            to={linkTo + studySet.studySetId}
            key={studySet.studySetId}>
            {studySet.title}
          </ArrowLink>
        ))}
      {!isLoadingOwn && !studySets?.length && (
        <p>You have not created any study sets</p>
      )}
      <SectionHead>Shared with you</SectionHead>
      {isLoadingShared && (
        <LoadingMessage>Loading study sets...</LoadingMessage>
      )}
      {!isLoadingShared &&
        sharedSets?.map((studySet) => (
          <ArrowLink
            to={(sharedTo ?? linkTo) + studySet.studySetId}
            key={studySet.studySetId}>
            {studySet.title}
          </ArrowLink>
        ))}
      {!isLoadingShared && !sharedSets?.length && (
        <p>There are no study sets shared with you</p>
      )}
    </>
  );
}
