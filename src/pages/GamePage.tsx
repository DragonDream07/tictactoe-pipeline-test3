import React, { useState, useCallback } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

type Marker = 'X' | 'O';
type Cell = Marker | null;
type Board = [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell];
type GameStatus = 'playing' | 'winner' | 'draw';

interface GameState {
  board: Board;
  status: GameStatus;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const WINNING_COMBINATIONS: readonly [number, number, number][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const EMPTY_BOARD: Board = [null, null, null, null, null, null, null, null, null];

// ─── Pure helpers ────────────────────────────────────────────────────────────

function detectWinner(board: Board): Marker | null {
  for (const [a, b, c] of WINNING_COMBINATIONS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a] as Marker;
    }
  }
  return null;
}

function isBoardFull(board: Board): boolean {
  return board.every((cell) => cell !== null);
}

function deriveCurrentPlayer(board: Board): Marker {
  const placed = board.filter((c) => c !== null).length;
  return placed % 2 === 0 ? 'X' : 'O';
}

function deriveWinner(board: Board): Marker | null {
  return detectWinner(board);
}

function deriveIsDraw(board: Board): boolean {
  return isBoardFull(board) && detectWinner(board) === null;
}

// ─── useGame hook ────────────────────────────────────────────────────────────

interface UseGameReturn {
  board: Board;
  status: GameStatus;
  currentPlayer: Marker;
  winner: Marker | null;
  isDraw: boolean;
  playMove: (index: number) => void;
  reset: () => void;
}

function useGame(): UseGameReturn {
  const [gameState, setGameState] = useState<GameState>({
    board: [...EMPTY_BOARD] as Board,
    status: 'playing',
  });

  const board = gameState.board;
  const status = gameState.status;
  const currentPlayer = deriveCurrentPlayer(board);
  const winner = deriveWinner(board);
  const isDraw = deriveIsDraw(board);

  const playMove = useCallback((index: number) => {
    setGameState((prev) => {
      // VR-05, VR-06: reject if game is over
      if (prev.status !== 'playing') return prev;
      // VR-01: reject if cell is occupied
      if (prev.board[index] !== null) return prev;

      const newBoard = [...prev.board] as Board;
      const player = deriveCurrentPlayer(prev.board);
      newBoard[index] = player;

      // VR-08: check winner
      if (detectWinner(newBoard) !== null) {
        return { board: newBoard, status: 'winner' };
      }

      // VR-09: check draw
      if (isBoardFull(newBoard)) {
        return { board: newBoard, status: 'draw' };
      }

      return { board: newBoard, status: 'playing' };
    });
  }, []);

  const reset = useCallback(() => {
    setGameState({
      board: [...EMPTY_BOARD] as Board,
      status: 'playing',
    });
  }, []);

  return { board, status, currentPlayer, winner, isDraw, playMove, reset };
}

// ─── Cell component ──────────────────────────────────────────────────────────

interface CellProps {
  value: Cell;
  index: number;
  isDisabled: boolean;
  isWinningCell: boolean;
  onCellClick: (index: number) => void;
}

function Cell({ value, index, isDisabled, isWinningCell, onCellClick }: CellProps) {
  const row = Math.floor(index / 3) + 1;
  const col = (index % 3) + 1;
  const valueLabel = value ?? 'empty';
  const ariaLabel = `Row ${row}, Column ${col}, ${valueLabel}`;

  const handleClick = () => {
    if (!isDisabled) {
      onCellClick(index);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!isDisabled) {
        onCellClick(index);
      }
    }
  };

  let className = 'board__cell';
  if (value === 'X') className += ' board__cell--x';
  if (value === 'O') className += ' board__cell--o';
  if (value !== null) className += ' board__cell--filled';
  if (isWinningCell) className += ' board__cell--winning';

  return (
    <button
      type="button"
      className={className}
      aria-label={ariaLabel}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={isDisabled}
    >
      {value ?? ''}
    </button>
  );
}

// ─── Board component ─────────────────────────────────────────────────────────

interface BoardProps {
  board: Board;
  isDisabled: boolean;
  winningCells: number[];
  onCellClick: (index: number) => void;
}

function Board({ board, isDisabled, winningCells, onCellClick }: BoardProps) {
  return (
    <section
      className="board"
      role="grid"
      aria-label="Tic-Tac-Toe board"
    >
      {board.map((cell, index) => (
        <Cell
          key={index}
          value={cell}
          index={index}
          isDisabled={isDisabled || cell !== null}
          isWinningCell={winningCells.includes(index)}
          onCellClick={onCellClick}
        />
      ))}
    </section>
  );
}

// ─── Status component ────────────────────────────────────────────────────────

interface StatusProps {
  status: GameStatus;
  currentPlayer: Marker;
  winner: Marker | null;
  isDraw: boolean;
}

function Status({ status, currentPlayer, winner, isDraw }: StatusProps) {
  let message: string;
  let className = 'status';

  if (status === 'winner' && winner) {
    message = `${winner} wins!`;
    className += ' status--winner';
  } else if (isDraw) {
    message = "It's a draw!";
    className += ' status--draw';
  } else {
    message = `${currentPlayer}'s turn`;
  }

  return (
    <p className={className} role="status" aria-live="polite">
      {message}
    </p>
  );
}

// ─── ResetButton component ───────────────────────────────────────────────────

interface ResetButtonProps {
  onReset: () => void;
}

function ResetButton({ onReset }: ResetButtonProps) {
  return (
    <button
      type="button"
      className="reset-button"
      onClick={onReset}
    >
      Reset
    </button>
  );
}

// ─── Helper: find winning cells ───────────────────────────────────────────────

function findWinningCells(board: Board): number[] {
  for (const [a, b, c] of WINNING_COMBINATIONS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return [a, b, c];
    }
  }
  return [];
}

// ─── CSS (injected into <style> via a style tag component) ───────────────────

const gameStyles = `
  :root {
    --color-bg-app: #0f172a;
    --color-bg-surface: #1e293b;
    --color-bg-board: #111827;
    --color-bg-cell: #1f2937;
    --color-bg-cell-hover: #374151;
    --color-text-primary: #f8fafc;
    --color-text-secondary: #94a3b8;
    --color-text-muted: #64748b;
    --color-text-on-accent: #ffffff;
    --color-marker-x: #38bdf8;
    --color-marker-o: #fb7185;
    --color-accent-primary: #6366f1;
    --color-accent-primary-hover: #4f46e5;
    --color-accent-focus-ring: #818cf8;
    --color-border-default: #334155;
    --color-border-strong: #475569;
    --color-state-win: #22c55e;
    --color-state-win-background: #14532d;
    --color-state-draw: #eab308;
    --radius-board: 1rem;
    --radius-cell: 0.5rem;
    --radius-button: 0.5rem;
    --shadow-board: 0 12px 32px rgba(0, 0, 0, 0.45);
    --shadow-focus: 0 0 0 3px rgba(129, 140, 248, 0.6);
    --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.35);
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 2rem;
    --spacing-2xl: 3rem;
    --spacing-grid-gap: 0.5rem;
    --font-family-base: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
    --font-size-xs: 0.75rem;
    --font-size-sm: 0.875rem;
    --font-size-base: 1rem;
    --font-size-lg: 1.25rem;
    --font-size-xl: 1.5rem;
    --font-size-2xl: 2rem;
    --font-size-title: 2.5rem;
    --font-size-marker: 3rem;
    --font-weight-regular: 400;
    --font-weight-medium: 500;
    --font-weight-semibold: 600;
    --font-weight-bold: 700;
    --letter-spacing-tight: -0.02em;
    --letter-spacing-wide: 0.05em;
    --line-height-normal: 1.5;
    --line-height-tight: 1.1;
    --transition-base: 180ms ease-out;
    --transition-fast: 120ms ease-out;
    --transition-slow: 300ms ease-in-out;
    --transition-button: background-color 180ms ease-out, box-shadow 180ms ease-out;
    --transition-cell: background-color 120ms ease-out, transform 120ms ease-out;
    --board-size: min(90vw, 420px);
    --cell-size: min(28vw, 128px);
  }

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: var(--font-family-base);
    background: var(--color-bg-app);
    color: var(--color-text-primary);
    min-height: 100vh;
    line-height: var(--line-height-normal);
  }

  .game-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    padding: var(--spacing-lg);
    background: var(--color-bg-app);
  }

  .game-page__header {
    text-align: center;
    margin-bottom: var(--spacing-lg);
  }

  .game-page__title {
    font-size: var(--font-size-title);
    font-weight: var(--font-weight-bold);
    letter-spacing: var(--letter-spacing-tight);
    color: var(--color-text-primary);
    line-height: var(--line-height-tight);
  }

  .game-page__subtitle {
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
    margin-top: var(--spacing-xs);
  }

  .game-page__main {
    width: 100%;
    max-width: 420px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-lg);
  }

  .status {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    min-height: 1.75rem;
    text-align: center;
    color: var(--color-text-primary);
  }

  .status--winner {
    color: var(--color-state-win);
  }

  .status--draw {
    color: var(--color-state-draw);
  }

  .board {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-grid-gap);
    width: var(--board-size);
    aspect-ratio: 1 / 1;
    background: var(--color-bg-board);
    padding: var(--spacing-sm);
    border-radius: var(--radius-board);
    box-shadow: var(--shadow-board);
  }

  .board__cell {
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-bg-cell);
    border: 1px solid var(--color-border-default);
    border-radius: var(--radius-cell);
    font-size: var(--font-size-marker);
    font-weight: var(--font-weight-bold);
    font-family: var(--font-family-base);
    aspect-ratio: 1 / 1;
    cursor: pointer;
    color: var(--color-text-primary);
    transition: var(--transition-cell);
    outline: none;
  }

  .board__cell:hover:not(:disabled) {
    background: var(--color-bg-cell-hover);
    transform: scale(1.03);
  }

  .board__cell:focus-visible {
    box-shadow: var(--shadow-focus);
    outline: none;
  }

  .board__cell:disabled {
    cursor: default;
  }

  .board__cell--x {
    color: var(--color-marker-x);
  }

  .board__cell--o {
    color: var(--color-marker-o);
  }

  .board__cell--filled {
    cursor: default;
  }

  .board__cell--winning {
    background: var(--color-state-win-background);
    border-color: var(--color-state-win);
  }

  .reset-button {
    background: var(--color-accent-primary);
    color: var(--color-text-on-accent);
    border: none;
    border-radius: var(--radius-button);
    padding: 0.75rem 1.5rem;
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-semibold);
    font-family: var(--font-family-base);
    cursor: pointer;
    transition: var(--transition-button);
    outline: none;
  }

  .reset-button:hover {
    background: var(--color-accent-primary-hover);
  }

  .reset-button:focus-visible {
    box-shadow: var(--shadow-focus);
    outline: none;
  }

  .game-page__footer {
    margin-top: var(--spacing-xl);
    color: var(--color-text-muted);
    font-size: var(--font-size-xs);
    text-align: center;
  }

  @media (max-width: 480px) {
    .game-page__title {
      font-size: var(--font-size-2xl);
    }

    .board__cell {
      font-size: 2.25rem;
    }
  }
`;

// ─── StyleInjector ───────────────────────────────────────────────────────────

function StyleInjector() {
  return <style dangerouslySetInnerHTML={{ __html: gameStyles }} />;
}

// ─── GamePage ─────────────────────────────────────────────────────────────────

export default function GamePage() {
  const { board, status, currentPlayer, winner, isDraw, playMove, reset } = useGame();

  const isGameOver = status === 'winner' || status === 'draw';
  const winningCells = status === 'winner' ? findWinningCells(board) : [];

  const handleCellClick = (index: number) => {
    playMove(index);
  };

  const handleReset = () => {
    reset();
  };

  return (
    <>
      <StyleInjector />
      <div className="game-page">
        <header className="game-page__header">
          <h1 className="game-page__title">Tic-Tac-Toe</h1>
          <p className="game-page__subtitle">Two-player · pass and play</p>
        </header>

        <main className="game-page__main">
          <Status
            status={status}
            currentPlayer={currentPlayer}
            winner={winner}
            isDraw={isDraw}
          />

          <Board
            board={board}
            isDisabled={isGameOver}
            winningCells={winningCells}
            onCellClick={handleCellClick}
          />

          <ResetButton onReset={handleReset} />
        </main>

        <footer className="game-page__footer">
          <p>Tic-Tac-Toe — Two player, pass and play.</p>
        </footer>
      </div>
    </>
  );
}
