import { useNavigate, useParams } from 'react-router-dom';
import { Back } from '../components/Back';
import {
  addCard,
  deleteCard,
  fillCardViaName,
  FilledCard,
  getAllPokemon,
  isFilledCard,
  NewCard,
  readCard,
  readStudySet,
  StudySet,
  updateCard,
} from '../lib';
import { FormEvent, useEffect, useState } from 'react';
import { PokemonCard } from '../components/PokemonCard';
import { Button } from '../components/Button';
import { BackOfCard } from '../components/BackOfCard';
import { AutocompleteInput } from '../components/AutocompleteInput';
import { RedButton } from '../components/RedButton';

type FormInputs = {
  pokemon: string;
  infoType: 'types' | 'flavor_text_entries' | 'evolves_from_species';
};

export function CardEditor(): JSX.Element {
  const [card, setCard] = useState<FilledCard | NewCard>();
  const [studySet, setStudySet] = useState<StudySet>();
  const [isLoading, setIsLoading] = useState(true);
  const [allPokemon, setAllPokemon] = useState<string[]>([]);
  const { cardId, studySetId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadStudySet(studySetId: number): Promise<void> {
      const studySet = await readStudySet(studySetId);
      setStudySet(studySet);
    }

    async function loadCard(cardId: number): Promise<void> {
      const card = await readCard(cardId);
      setCard(card);
    }

    async function setUp(): Promise<void> {
      try {
        if (!studySetId || !cardId) {
          throw new Error('studySetId and cardId are required');
        }

        await loadStudySet(+studySetId);

        if (cardId === 'new') {
          setCard({
            studySetId: +studySetId,
            pokemonId: 0,
            pokemonName: '',
            pokemonImageUrl: '',
            infoKey: 'types',
            info: [],
          });
        } else {
          await loadCard(+cardId);
        }

        const allPokemon = await getAllPokemon();
        setAllPokemon(allPokemon);
      } catch (err) {
        console.error(err);
        alert(err);
      } finally {
        setIsLoading(false);
      }
    }
    setUp();
  }, [cardId, studySetId]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();
    try {
      if (!card) throw new Error('card is not defined');
      setIsLoading(true);
      const formData = new FormData(event.currentTarget);
      const pokemonData = Object.fromEntries(formData) as FormInputs;
      const newCard = await fillCardViaName(
        card,
        pokemonData.pokemon,
        pokemonData.infoType
      );
      setCard(newCard);
    } catch (err) {
      console.error(err);
      alert(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAdd(): Promise<void> {
    try {
      setIsLoading(true);
      if (!card) {
        alert('cannot add if not card');
        return;
      }
      await addCard(card);
      navigate(`/study-sets/${studySetId}`);
    } catch (err) {
      console.error(err);
      alert(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUpdate(): Promise<void> {
    try {
      setIsLoading(true);
      if (!isFilledCard(card)) {
        alert('cannot update if not cardId');
        return;
      }
      await updateCard(card);
      navigate(`/study-sets/${studySetId}`);
    } catch (err) {
      console.error(err);
      alert(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(): Promise<void> {
    try {
      if (!cardId) throw new Error('no cardId provided');
      setIsLoading(true);
      await deleteCard(+cardId);
      navigate(`/study-sets/${studySetId}`);
    } catch (err) {
      console.error(err);
      alert(err);
    }
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!card || !studySet) {
    return <div>Error! either card or study set does not exist</div>;
  }

  return (
    <div>
      <Back to={`/study-sets/${studySetId}`}>{studySet.title}</Back>
      <form onSubmit={handleSubmit}>
        <label
          className="text-2xl"
          style={{
            fontFamily: 'Kanit, sans-serif',
            fontWeight: 600,
          }}>
          Pokemon:{' '}
          <AutocompleteInput
            required={true}
            completeWith={allPokemon}
            defaultValue={card.pokemonName}
          />
        </label>
        <PokemonCard
          imageSrc={card.pokemonImageUrl}
          caption={card.pokemonName}
        />
        <label
          className="text-2xl"
          style={{
            fontFamily: 'Kanit, sans-serif',
            fontWeight: 600,
          }}>
          Info:{' '}
          <select
            defaultValue={card.infoKey}
            className="border-2 rounded px-2"
            style={{
              fontFamily: 'Quicksand, sans-serif',
              fontWeight: 'normal',
            }}
            name="infoType">
            <option value="types">Types</option>
            <option value="flavor_text_entries">Pokedex</option>
            <option value="evolves_from_species">Evolves From</option>
          </select>
        </label>
        <BackOfCard card={card} />
        <Button>Refresh</Button>
      </form>
      {cardId === 'new' && card.pokemonName && (
        <Button onClick={handleAdd}>Add Card</Button>
      )}
      {cardId !== 'new' && (
        <>
          <Button onClick={handleUpdate}>Save Changes</Button>
          <RedButton onClick={handleDelete}>Delete card</RedButton>
        </>
      )}
    </div>
  );
}
