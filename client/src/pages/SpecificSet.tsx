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
          const defaultSet = { title: 'My Study Set' };
          const studySet = await addSet(defaultSet);
          navigate(`/study-sets/${studySet?.studySetId}`);
        } else {
          await loadStudySet(+studySetId);
          await loadCards(+studySetId);
        }
      } catch (err) {
        console.error(err);
        alert(err);
      } finally {
        setIsLoading(false);
      }
    }
    setUp();
  }, [studySetId, navigate]);

  return (
    <div className="container px-2">
      <Back to="/study-sets">All Study Sets</Back>
      <SectionHead>
        <form>
          <input
            className='className="border-2 rounded px-2"'
            defaultValue={studySet?.title}
          />
        </form>
      </SectionHead>
      <NewCard />
      {isLoading && <p>Loading...</p>}
      {!isLoading && (
        <>
          {cards?.map((card) => (
            <BothSidesCard key={card.cardId} card={card} />
          ))}
        </>
      )}
    </div>
  );
}
