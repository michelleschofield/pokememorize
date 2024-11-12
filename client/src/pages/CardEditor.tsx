import { useParams } from 'react-router-dom';
import { Back } from '../components/Back';
import {
  FilledCard,
  PokemonType,
  readCard,
  readStudySet,
  StudySet,
} from '../lib';
import { useEffect, useState } from 'react';
import { capitalizeWord } from '../lib/capitalize';
import { PokemonCard } from '../components/PokemonCard';
import { TypesCard } from '../components/TypesCard';

type NewCard = {
  studySetId: number;
  pokemonId: number;
  pokemonName: string;
  pokemonImageUrl: string;
  infoType: string;
  info: PokemonType[];
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
            infoType: '',
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!card || !studySet) {
    return <div>Error! either card or study set does not exist</div>;
  }

  return (
    <div className="container px-2">
      <Back to={`/study-sets/${studySetId}`}>{studySet.title}</Back>
      <h3 className="text-2xl">
        Pokemon:{' '}
        <span
          style={{
            fontFamily: 'Quicksand, sans-serif',
            fontWeight: 'normal',
          }}>
          {capitalizeWord(card.pokemonName)}
        </span>
      </h3>
      <h3>change pokemon</h3>
      <PokemonCard
        imageSrc={card.pokemonImageUrl}
        caption={capitalizeWord(card.pokemonName)}
      />
      <h3 className="text-2xl">
        Info:{' '}
        <span
          style={{
            fontFamily: 'Quicksand, sans-serif',
            fontWeight: 'normal',
          }}>
          {capitalizeWord(card.infoType)}
        </span>
      </h3>
      <TypesCard types={card.info} />{' '}
    </div>
  );
}
