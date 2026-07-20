interface ProcessButtonProps {
  onProcessStart: () => void;
  isLoading: boolean;
}

export default function ProcessButton({ onProcessStart, isLoading }: ProcessButtonProps) {
  if (isLoading) {
    return <div>processing...</div>;
  }

  return (
    <div>
      <button onClick={onProcessStart}>Process</button>
    </div>
  );
}
