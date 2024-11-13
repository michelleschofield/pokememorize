type Props = {
  caption: string;
  imageSrc: string;
};

export function PokemonCard({ caption, imageSrc }: Props) {
  return (
    <div className="card justify-center">
      <img src={imageSrc} className="w-full" />
      <h3 className="text-2xl">{caption}</h3>
    </div>
  );
}
