import React, { useEffect, useState } from 'react';
import '../App.css';

// Chimp test: click the numbered squares in order; difficulty increases
function ChimpTest() {
  const [status, setStatus] = useState('intro'); // intro, playing, summary, gameover
  const [cells, setCells] = useState([]); // 3x3 grid values
  const [nextExpected, setNextExpected] = useState(1);
  const [numbersCount, setNumbersCount] = useState(4);
  const [score, setScore] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    const stored = localStorage.getItem('chimpBestScore');
    return stored ? parseInt(stored, 10) : 0;
  });

  const shuffle = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const createRound = (currentScore) => {
    const count = Math.min(4 + currentScore, 9); // increase numbers as score rises
    const nums = Array.from({ length: count }, (_, i) => i + 1);
    const baseCells = Array(9).fill(null);
    nums.forEach((n, index) => {
      baseCells[index] = n;
    });
    setCells(shuffle(baseCells));
    setNumbersCount(count);
    setNextExpected(1);
  };

  const startTest = () => {
    setScore(0);
    setStrikes(0);
    createRound(0);
    setStatus('playing');
  };

  const handleCellClick = (value, index) => {
    if (status !== 'playing' || value === null) return;

    if (value === nextExpected) {
      const updated = [...cells];
      updated[index] = null;
      setCells(updated);

      if (nextExpected === numbersCount) {
        setScore((prev) => prev + 1);
        setTimeout(() => {
          setStatus('summary');
        }, 300);
      } else {
        setNextExpected((prev) => prev + 1);
      }
    } else {
      const newStrikes = strikes + 1;
      setStrikes(newStrikes);
      if (newStrikes >= 3) {
        setTimeout(() => {
          finishGame();
        }, 300);
      } else {
        setTimeout(() => {
          setStatus('summary');
        }, 300);
      }
    }
  };

  const finishGame = () => {
    setStatus('gameover');
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem('chimpBestScore', String(score));
    }
  };

  const handleContinue = () => {
    if (status !== 'summary') return;
    if (strikes >= 3) {
      finishGame();
      return;
    }
    createRound(score);
    setStatus('playing');
  };

  useEffect(() => {
    // Ensure grid is initialised when returning to this test
    if (status === 'playing' && cells.length === 0) {
      createRound(score);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <div className="game-screen">
      {status === 'intro' && (
        <div className="start-screen">
          <div className="icon-container">
            <div className="grid-icon">
              <div className="grid-square" />
              <div className="grid-square" />
              <div className="grid-square" />
              <div className="grid-square outlined" />
            </div>
          </div>
          <h1 className="title">Are You Smarter Than a Chimpanzee?</h1>
          <p className="description">
            Click the squares in order according to their numbers. The test will
            get progressively harder.
          </p>
          <button type="button" className="start-btn" onClick={startTest}>
            START TEST
          </button>
          <div className="high-score">
            Best score: {bestScore}
          </div>
        </div>
      )}

      {status === 'playing' && (
        <>
          <div className="level-indicator">Score: {score} &bull; Strikes: {strikes} / 3</div>
          <div className="game-grid">
            {cells.map((value, index) => (
              <button
                type="button"
                key={index}
                className={`grid-cell ${value === null ? 'clicked' : ''}`}
                onClick={() => handleCellClick(value, index)}
                disabled={value === null}
              >
                {value}
              </button>
            ))}
          </div>
        </>
      )}

      {status === 'summary' && (
        <div className="gameover-screen">
          <h2 className="gameover-title">Numbers {numbersCount}</h2>
          <p className="gameover-message">
            Strikes {strikes} of 3
          </p>
          <button
            type="button"
            className="restart-btn"
            onClick={handleContinue}
          >
            Continue
          </button>
        </div>
      )}

      {status === 'gameover' && (
        <div className="gameover-screen">
          <div className="icon-container">
            <div className="grid-icon">
              <div className="grid-square" />
              <div className="grid-square" />
              <div className="grid-square" />
              <div className="grid-square outlined" />
            </div>
          </div>
          <h2 className="gameover-title">Score</h2>
          <p className="gameover-message">{score}</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button type="button" className="restart-btn" disabled>
              Save score
            </button>
            <button type="button" className="restart-btn" onClick={startTest}>
              Try again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChimpTest;
