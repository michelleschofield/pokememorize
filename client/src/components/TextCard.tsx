type Props = {
  text: string;
};

export function TextCard({ text }: Props) {
  return (
    <div className="card">
      <p>{text}</p>
    </div>
  );
}
