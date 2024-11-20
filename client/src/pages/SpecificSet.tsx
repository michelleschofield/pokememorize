import { useState, useEffect, FormEvent } from 'react';
import { Back } from '../components/Back';
import {
  addSet,
  deleteSet,
  FilledCard,
  readCards,
  readStudySet,
  shareSet,
  StudySet,
  updateSet,
} from '../lib';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { NewCard } from '../components/NewCard';
import { BothSidesCard } from '../components/BothSidesCard';
import { SectionHead } from '../components/SectionHead';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { RedButton } from '../components/RedButton';
import { LoadingMessage } from '../components/LoadingMessage';
import { TextInput } from '../components/TextInput';

type Props = {
  shared?: boolean;
};

export function SpecificSet({ shared }: Props): JSX.Element {
  const [cards, setCards] = useState<FilledCard[]>();
  const [studySet, setStudySet] = useState<StudySet>();
  const [isLoadingCards, setIsLoadingCards] = useState(true);
  const [isLoadingSet, setIsLoadingSet] = useState(true);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const { studySetId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadStudySet(studySetId: number): Promise<void> {
      const studySet = await readStudySet(studySetId);
      setStudySet(studySet);
    }

    async function loadCards(studySetId: number): Promise<void> {
      const cards = await readCards(studySetId);
      setCards(cards);
    }

    async function setUp(): Promise<void> {
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

  useEffect(() => {}, []);

  async function handleTitleChange(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
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

  async function handleShare(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    try {
      if (!studySetId) throw new Error('there is no studySetId');
      const formData = new FormData(event.currentTarget);
      const { username } = Object.fromEntries(formData) as { username: string };
      await shareSet(+studySetId, username);
    } catch (err) {
      alert(err);
      console.error(err);
    } finally {
      setShareModalOpen(false);
    }
  }

  return (
    <div>
      <Back to="/study-sets">All Study Sets</Back>
      <SectionHead>
        {isLoadingSet && <LoadingMessage>Loading Study Set...</LoadingMessage>}
        {!isLoadingSet && (
          <>
            <form onSubmit={handleTitleChange}>
              <TextInput
                disabled={shared}
                required
                name="title"
                defaultValue={studySet?.title}
              />
              {!shared && <Button>Update Title</Button>}
            </form>
            {!shared && (
              <>
                <RedButton onClick={() => setDeleteModalIsOpen(true)}>
                  Delete Set
                </RedButton>
                <Button onClick={() => setShareModalOpen(true)}>
                  Share Set
                </Button>
              </>
            )}
          </>
        )}
      </SectionHead>
      {!shared && <NewCard />}
      {isLoadingCards && <LoadingMessage>Loading Cards...</LoadingMessage>}
      {!isLoadingCards && (
        <div className="flex flex-wrap">
          {cards?.map((card) => (
            <Link
              className={shared ? 'cursor-default' : ''}
              key={card.cardId}
              to={shared ? '' : `${card.cardId}`}>
              <BothSidesCard card={card} />
            </Link>
          ))}
        </div>
      )}
      <Modal
        onClose={() => setDeleteModalIsOpen(false)}
        isOpen={deleteModalIsOpen}>
        <div className="m-2">
          <p>Are you sure you want to delete? This action cannot be undone</p>
          <Button onClick={() => setDeleteModalIsOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
      <Modal
        className="rounded p-2"
        onClose={() => setShareModalOpen(false)}
        isOpen={shareModalOpen}>
        <form className="flex items-center" onSubmit={handleShare}>
          <label className="flex">
            <p className="mr-2">Username:</p>
            <TextInput
              name="username"
              style={{
                fontFamily: 'Quicksand, sans-serif',
                fontWeight: 'normal',
              }}
            />
          </label>
          <Button>Share</Button>
        </form>
        <Button onClick={() => setShareModalOpen(false)}>Cancel</Button>
      </Modal>
    </div>
  );
}
