import React, { useEffect, useState, useContext } from 'react';
import styles from '../styles/ChimpTest.module.css';
import { LanguageContext } from '../contexts/LanguageContext';
import { translations } from '../translations';

const GRID_SIZE = 9;

function ChimpTest() {
  const [status, setStatus] = useState('intro'); // intro, playing, summary, gameover
  const [cells, setCells] = useState([]);
  const [nextExpected, setNextExpected] = useState(1);
  const [numbersCount, setNumbersCount] = useState(4);
  const [score, setScore] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    const stored = localStorage.getItem('chimpBestScore');
    return stored ? parseInt(stored, 10) : 0;
  });
  const { language } = useContext(LanguageContext);
  const t = translations[language];

  const shuffle = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const createRound = (currentScore) => {
    const count = Math.min(4 + currentScore, GRID_SIZE);
    const nums = Array.from({ length: count }, (_, i) => i + 1);
    const baseCells = Array(GRID_SIZE).fill(null);
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
        setTimeout(() => setStatus('summary'), 300);
      } else {
        setNextExpected((prev) => prev + 1);
      }
    } else {
      const newStrikes = strikes + 1;
      setStrikes(newStrikes);
      if (newStrikes >= 3) {
        setTimeout(() => finishGame(), 300);
      } else {
        setTimeout(() => setStatus('summary'), 300);
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
    if (status === 'playing' && cells.length === 0) {
      createRound(score);
    }
  }, [status, cells.length, score]);

  const renderIntro = () => (
    <div className={styles.screen}>
      <h1 className={styles.title}>{t.chimpTestTitle}</h1>
      <p className={styles.description}>{t.chimpTestInstruction}</p>
      <button type="button" className={styles.button} onClick={startTest}>
        {t.startTest}
      </button>
      <p className={styles.bestScore}>{t.bestScore}: {bestScore}</p>
    </div>
  );

  const renderPlaying = () => (
    <div className={styles.gameContainer}>
      <div className={styles.statusBar}>
        {t.score}: {score} &bull; {t.strikes}: {strikes} / 3
      </div>
      <div className={styles.grid}>
        {cells.map((value, index) => (
          <button
            type="button"
            key={index}
            className={`${styles.cell} ${value === null ? styles.clicked : ''}`}
            onClick={() => handleCellClick(value, index)}
            disabled={value === null}
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  );

  const renderSummary = () => (
    <div className={styles.screen}>
      <h2 className={styles.title}>{t.numbersLevel.replace('{numbersCount}', numbersCount)}</h2>
      <p className={styles.description}>{t.strikes} {strikes} of 3</p>
      <button type="button" className={styles.button} onClick={handleContinue}>
        {t.continue}
      </button>
    </div>
  );

  const renderGameOver = () => (
    <div className={styles.screen}>
      <h2 className={styles.title}>{t.score}</h2>
      <p className={styles.finalScore}>{score}</p>
      <div className={styles.buttonGroup}>
        <button type="button" className={styles.button} disabled>
          {t.saveScore}
        </button>
        <button type="button" className={styles.button} onClick={startTest}>
          {t.tryAgain}
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (status) {
      case 'intro':
        return renderIntro();
      case 'playing':
        return renderPlaying();
      case 'summary':
        return renderSummary();
      case 'gameover':
        return renderGameOver();
      default:
        return null;
    }
  };

  return <div className={styles.container}>{renderContent()}</div>;
}

export default ChimpTest;
