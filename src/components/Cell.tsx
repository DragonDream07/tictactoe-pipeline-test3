import React from 'react';

type CellValue = 'X' | 'O' | null;

interface CellProps {
  value: CellValue;
  onClick: () => void;
  isWinningCell?: boolean;
  row: number;
  col: number;
  isDisabled?: boolean;
}

function Cell({
  value,
  onClick,
  isWinningCell = false,
  row,
  col,
  isDisabled = false,
}: CellProps): JSX.Element {
  const label =
    value
      ? `Row ${row}, Column ${col}, ${value}`
      : `Row ${row}, Column ${col}, empty`;

  const classNames = [
    'board__cell',
    value ? 'board__cell--filled' : '',
    value === 'X' ? 'board__cell--x' : '',
    value === 'O' ? 'board__cell--o' : '',
    isWinningCell ? 'board__cell--winning' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={classNames}
      onClick={onClick}
      aria-label={label}
      disabled={isDisabled || value !== null}
      role="gridcell"
    >
      {value ?? ''}
    </button>
  );
}

export default Cell;
