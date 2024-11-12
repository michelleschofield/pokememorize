import { useState, useEffect } from 'react';
import { Back } from '../components/Back';
import { FilledCard, readCards } from '../lib';
import { useParams } from 'react-router-dom';

export function SpecificSet() {
  const [cards, setCards] = useState<FilledCard[]>();
  const [isLoading, setIsLoading] = useState(true);
  const { studySetId } = useParams();

  useEffect(() => {
    async function loadCards(studySetId: number) {
      try {
        const cards = await readCards(studySetId);
        setCards(cards);
      } catch (err) {
        console.error(err);
        alert(err);
      } finally {
        setIsLoading(false);
      }
    }
    if (studySetId) {
      loadCards(+studySetId);
    }
  }, [studySetId]);

  return (
    <div className="container px-2">
      <Back to="/study-sets">All Study Sets</Back>
      {isLoading && <p>Loading...</p>}
      {cards && cards[0].pokemonName}
    </div>
  );
}
