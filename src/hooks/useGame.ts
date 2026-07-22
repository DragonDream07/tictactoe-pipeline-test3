import { useState, useCallback } from 'react';

type Player = 'X' | 'O';
type CellValue = Player | null;
type Board = CellValue[];

const WINNING_LINES: [number, number, number][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function computeWinner(board: Board): Player | null {
  for (const [a, b, c] of WINNING_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a] as Player;
    }
  }
  return null;
}

function computeCurrentPlayer(board: Board): Player {
  const xCount = board.filter((cell) => cell === 'X').length;
  const oCount = board.filter((cell) => cell === 'O').length;
  return xCount <= oCount ? 'X' : 'O';
}

export interface UseGameReturn {
  board: Board;
  currentPlayer: Player;
  winner: Player | null;
  isDraw: boolean;
  playMove: (index: number) => void;
  reset: () => void;
}

const INITIAL_BOARD: Board = Array(9).fill(null);

export function useGame(): UseGameReturn {
  const [board, setBoard] = useState<Board>(INITIAL_BOARD);

  const winner = computeWinner(board);
  const currentPlayer = computeCurrentPlayer(board);
  const isDraw = !winner && board.every((cell) => cell !== null);

  const playMove = useCallback(
    (index: number): void => {
      setBoard((prev) => {
        const currentWinner = computeWinner(prev);
        if (currentWinner || prev[index] !== null) {
          return prev;
        }
        const next = [...prev] as Board;
        next[index] = computeCurrentPlayer(prev);
        return next;
      });
    },
    [],
  );

  const reset = useCallback((): void => {
    setBoard([...INITIAL_BOARD]);
  }, []);

  return {
    board,
    currentPlayer,
    winner,
    isDraw,
    playMove,
    reset,
  };
}

export default useGame;
