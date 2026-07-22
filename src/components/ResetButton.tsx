import React from 'react';

interface ResetButtonProps {
  onReset: () => void;
}

function ResetButton({ onReset }: ResetButtonProps): JSX.Element {
  return (
    <button
      className="reset-button"
      onClick={onReset}
      aria-label="Start a new game"
    >
      New Game
    </button>
  );
}

export default ResetButton;
