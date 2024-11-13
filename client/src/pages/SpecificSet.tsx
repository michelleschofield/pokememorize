import { useState, useEffect } from 'react';
import { Back } from '../components/Back';
import {
  addSet,
  FilledCard,
  NewSet,
  readCards,
  readStudySet,
  StudySet,
} from '../lib';
import { useNavigate, useParams } from 'react-router-dom';
import { NewCard } from '../components/NewCard';
import { BothSidesCard } from '../components/BothSidesCard';
import { SectionHead } from '../components/SectionHead';
import { Button } from '../components/Button';

export function SpecificSet() {
  const [cards, setCards] = useState<FilledCard[]>();
  const [studySet, setStudySet] = useState<StudySet | NewSet>();
  const [isLoading, setIsLoading] = useState(true);
  const { studySetId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadStudySet(studySetId: number) {
      const studySet = await readStudySet(studySetId);
      setStudySet(studySet);
    }

    async function loadCards(studySetId: number) {
      const cards = await readCards(studySetId);
      setCards(cards);
    }

    async function setUp() {
      try {
        if (!studySetId) throw new Error('there must be a study set');
        if (studySetId === 'new') {
          setStudySet({ title: 'My Set' });
          setCards([]);
        } else {
          await loadCards(+studySetId);
          await loadStudySet(+studySetId);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    setUp();
  }, [studySetId]);

  function handleAdd(): void {
    if (!studySet) {
      alert('cannot add if not studySet');
      return;
    }
    addSet(studySet);
    navigate('/study-sets');
  }

  return (
    <div className="container px-2">
      <Back to="/study-sets">All Study Sets</Back>
      <SectionHead>
        <input
          className='className="border-2 rounded px-2"'
          defaultValue={studySet?.title}
        />
      </SectionHead>
      <NewCard />
      {isLoading && <p>Loading...</p>}
      {!isLoading && (
        <>
          {cards?.map((card) => (
            <BothSidesCard key={card.cardId} card={card} />
          ))}
          <Button onClick={handleAdd}>Add set</Button>
        </>
      )}
    </div>
  );
}
