import { useState, useEffect, FormEvent } from 'react';
import { Back } from '../components/Back';
import {
  addSet,
  deleteSet,
  FilledCard,
  readCards,
  readStudySet,
  StudySet,
  updateSet,
} from '../lib';
import { useNavigate, useParams } from 'react-router-dom';
import { NewCard } from '../components/NewCard';
import { BothSidesCard } from '../components/BothSidesCard';
import { SectionHead } from '../components/SectionHead';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';

export function SpecificSet() {
  const [cards, setCards] = useState<FilledCard[]>();
  const [studySet, setStudySet] = useState<StudySet>();
  const [isLoadingCards, setIsLoadingCards] = useState(true);
  const [isLoadingSet, setIsLoadingSet] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
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
        setIsLoadingCards(false);
        setIsLoadingSet(false);
      }
    }
    setUp();
  }, [studySetId, navigate]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setIsLoadingSet(true);
      if (!studySet?.studySetId) throw new Error('study set must have an id');
      const formData = new FormData(event.currentTarget);
      const { title } = Object.fromEntries(formData) as { title: string };
      const updatedSet = await updateSet({
        studySetId: studySet.studySetId,
        title,
      });
      setStudySet(updatedSet);
    } catch (err) {
      alert(err);
      console.error(err);
    } finally {
      setIsLoadingSet(false);
    }
  }

  async function handleDelete(): Promise<void> {
    try {
      if (!studySetId) {
        alert('cannot delete if not study set id');
        return;
      }
      await deleteSet(+studySetId);
      navigate('/study-sets');
    } catch (err) {
      console.error(err);
      alert(err);
    }
  }

  return (
    <div>
      <Back to="/study-sets">All Study Sets</Back>
      <SectionHead>
        {isLoadingSet && <p>Loading...</p>}
        {!isLoadingSet && (
          <>
            <form onSubmit={handleSubmit}>
              <input
                required
                name="title"
                className="border-2 rounded px-2"
                defaultValue={studySet?.title}
              />
              <Button>Update Title</Button>
            </form>
            <Button onClick={() => setModalIsOpen(true)}>Delete Set</Button>
          </>
        )}
      </SectionHead>
      <NewCard />
      {isLoadingCards && <p>Loading...</p>}
      {!isLoadingCards && (
        <div className="flex flex-wrap">
          {cards?.map((card) => (
            <BothSidesCard key={card.cardId} card={card} />
          ))}
        </div>
      )}
      <Modal onClose={() => setModalIsOpen(false)} isOpen={modalIsOpen}>
        <p>Are you sure you want to delete? This action cannot be undone</p>
        <Button onClick={() => setModalIsOpen(false)}>Cancel</Button>
        <Button onClick={handleDelete}>Delete</Button>
      </Modal>
    </div>
  );
}
