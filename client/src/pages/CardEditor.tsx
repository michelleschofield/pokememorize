import { useParams } from 'react-router-dom';
import { Back } from '../components/Back';
import {
  fillCardViaName,
  FilledCard,
  NewCard,
  readCard,
  readStudySet,
  StudySet,
} from '../lib';
import { FormEvent, useEffect, useState } from 'react';
import { PokemonCard } from '../components/PokemonCard';
import { TypesCard } from '../components/TypesCard';
import { Button } from '../components/Button';

type FormInputs = {
  pokemon: string;
  infoType: string;
};

export function CardEditor() {
  const [card, setCard] = useState<FilledCard | NewCard>();
  const [studySet, setStudySet] = useState<StudySet>();
  const [isLoading, setIsLoading] = useState(true);
  const { cardId, studySetId } = useParams();

  useEffect(() => {
    async function loadStudySet(studySetId: number) {
      const studySet = await readStudySet(studySetId);
      setStudySet(studySet);
    }

    async function loadCard(cardId: number) {
      const card = await readCard(cardId);
      setCard(card);
    }

    async function setUp() {
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
            infoType: 'types',
            info: [],
          });
        } else {
          await loadCard(+cardId);
        }
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!card || !studySet) {
    return <div>Error! either card or study set does not exist</div>;
  }

  return (
    <div className="container px-2">
      <Back to={`/study-sets/${studySetId}`}>{studySet.title}</Back>
      <form onSubmit={handleSubmit}>
        <label
          className="text-2xl"
          style={{
            fontFamily: 'Kanit, sans-serif',
            fontWeight: 600,
          }}>
          Pokemon:{' '}
          <input
            required
            name="pokemon"
            className="border-2 rounded px-2"
            style={{
              fontFamily: 'Quicksand, sans-serif',
              fontWeight: 'normal',
            }}
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
          <input
            required
            name="infoType"
            className="border-2 rounded px-2"
            style={{
              fontFamily: 'Quicksand, sans-serif',
              fontWeight: 'normal',
            }}
            defaultValue={card.infoType}></input>
        </label>
        <TypesCard types={card.info} />
        <Button>Submit</Button>
      </form>
    </div>
  );
}
