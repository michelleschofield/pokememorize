import { useEffect, useState } from 'react';
import { ArrowLink } from '../components/ArrowLink';
import { SectionHead } from '../components/SectionHead';
import { readStudySets, StudySet } from '../lib';

export function StudySets() {
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
    <div className="container px-2">
      <ArrowLink to="/study-sets/new" label="Make a new set" />
      <SectionHead>Your Study Sets</SectionHead>
      {isLoading && <p>Loading...</p>}
      {!isLoading &&
        studySets?.map((studySet) => (
          <ArrowLink
            to={`/study-sets/${studySet.studySetId}`}
            key={studySet.studySetId}
            label={studySet.title}
          />
        ))}
    </div>
  );
}
