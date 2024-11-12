type Props = {
  caption: string;
  imageSrc: string;
};

export function PokemonCard({ caption, imageSrc }: Props) {
  return (
    <div className="card">
      <img src={imageSrc} className="card-image" />
      <h3>{caption}</h3>
    </div>
  );
}
