import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/about-page.css';

function AboutPage(): JSX.Element {
  return (
    <div className="about">
      <header className="about__header">
        <h1 className="about__title">About Tic-Tac-Toe</h1>
        <p className="about__subtitle">Two-player · pass and play</p>
      </header>

      <main className="about__main">
        <section className="about__section">
          <h2 className="about__section-title">What is Tic-Tac-Toe?</h2>
          <p className="about__text">
            Tic-Tac-Toe is a classic two-player strategy game played on a 3×3
            grid. Players take turns placing their marker — <span className="about__marker about__marker--x">X</span> or{' '}
            <span className="about__marker about__marker--o">O</span> — in an
            empty cell. The first player to claim three cells in a row, column,
            or diagonal wins the game.
          </p>
        </section>

        <section className="about__section">
          <h2 className="about__section-title">Rules</h2>
          <ol className="about__list">
            <li className="about__list-item">
              <strong>Player X always goes first.</strong> Every new game or
              reset starts with X to move.
            </li>
            <li className="about__list-item">
              <strong>Turns alternate strictly.</strong> After X places a
              marker it becomes O's turn, and vice versa.
            </li>
            <li className="about__list-item">
              <strong>You cannot overwrite an occupied cell.</strong> Clicking a
              cell that already holds a marker does nothing.
            </li>
            <li className="about__list-item">
              <strong>No moves after the game ends.</strong> Once a winner is
              declared or the board is full, all moves are blocked until you
              press Reset.
            </li>
            <li className="about__list-item">
              <strong>Win condition.</strong> Claim all three cells in any row,
              column, or diagonal.
            </li>
            <li className="about__list-item">
              <strong>Draw condition.</strong> If all 9 cells are filled with no
              winner, the game ends in a draw.
            </li>
            <li className="about__list-item">
              <strong>Reset.</strong> Press Reset at any time to clear the
              board, remove any outcome, and return X to the first move.
            </li>
          </ol>
        </section>

        <section className="about__section">
          <h2 className="about__section-title">Winning Combinations</h2>
          <p className="about__text">
            There are 8 ways to win — 3 rows, 3 columns, and 2 diagonals:
          </p>
          <ul className="about__combos">
            <li>Row 1: cells 1 – 2 – 3</li>
            <li>Row 2: cells 4 – 5 – 6</li>
            <li>Row 3: cells 7 – 8 – 9</li>
            <li>Column 1: cells 1 – 4 – 7</li>
            <li>Column 2: cells 2 – 5 – 8</li>
            <li>Column 3: cells 3 – 6 – 9</li>
            <li>Diagonal: cells 1 – 5 – 9</li>
            <li>Diagonal: cells 3 – 5 – 7</li>
          </ul>
        </section>

        <section className="about__section">
          <h2 className="about__section-title">Credits</h2>
          <p className="about__text">
            Built with React and TypeScript. Designed with accessibility in mind
            — fully keyboard-navigable and screen-reader friendly.
          </p>
        </section>

        <div className="about__nav">
          <Link to="/" className="about__back-link">
            ← Back to Game
          </Link>
        </div>
      </main>

      <footer className="about__footer">
        <p>Tic-Tac-Toe — Two-player pass and play</p>
      </footer>
    </div>
  );
}

export default AboutPage;
