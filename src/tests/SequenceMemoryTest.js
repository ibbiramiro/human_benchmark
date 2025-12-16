import React, { useState, useEffect, useContext } from 'react';
import styles from '../styles/SequenceMemoryTest.module.css';
import { LanguageContext } from '../contexts/LanguageContext';
import { translations } from '../translations';

const GRID_SIZE = 9;

function SequenceMemoryTest() {
  const [status, setStatus] = useState('intro'); // intro, showing, playing, gameover
  const [level, setLevel] = useState(1);
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [litCells, setLitCells] = useState([]);
  const { language } = useContext(LanguageContext);
  const t = translations[language];

  const generateSequence = (currentLevel) => {
    const newSequence = [];
    const availableCells = Array.from({ length: GRID_SIZE }, (_, i) => i);
    for (let i = 0; i < currentLevel; i++) {
      const randomIndex = Math.floor(Math.random() * availableCells.length);
      newSequence.push(availableCells.splice(randomIndex, 1)[0]);
    }
    setSequence(newSequence);
  };

  const showSequence = () => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < sequence.length) {
        setLitCells([sequence[i]]);
        i++;
      } else {
        clearInterval(interval);
        setLitCells([]);
        setStatus('playing');
      }
    }, 600);
  };

  const startLevel = () => {
    setPlayerSequence([]);
    generateSequence(level);
    setStatus('showing');
  };

  useEffect(() => {
    if (status === 'showing') {
      showSequence();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, sequence]);

  const handleCellClick = (index) => {
    if (status !== 'playing') return;

    const newPlayerSequence = [...playerSequence, index];
    setPlayerSequence(newPlayerSequence);

    if (sequence[newPlayerSequence.length - 1] !== index) {
      setStatus('gameover');
      return;
    }

    if (newPlayerSequence.length === sequence.length) {
      setLevel(level + 1);
      setTimeout(() => startLevel(), 1000);
    }
  };

  const handleStart = () => {
    setLevel(1);
    startLevel();
  };

  const renderGrid = () => (
    <div className={styles.grid}>
      {Array.from({ length: GRID_SIZE }).map((_, i) => (
        <button
          key={i}
          className={`${styles.cell} ${litCells.includes(i) ? styles.lit : ''}`}
          onClick={() => handleCellClick(i)}
          disabled={status !== 'playing'}
        />
      ))}
    </div>
  );

  const renderContent = () => {
    switch (status) {
      case 'intro':
        return (
          <div className={styles.screen}>
            <h1 className={styles.title}>{t.sequenceMemoryTestTitle}</h1>
            <p className={styles.description}>{t.memorizeThePattern}</p>
            <button className={styles.button} onClick={handleStart}>{t.start}</button>
          </div>
        );
      case 'showing':
      case 'playing':
        return (
          <div>
            <div className={styles.levelIndicator}>{t.level} {level}</div>
            {renderGrid()}
          </div>
        );
      case 'gameover':
        return (
          <div className={styles.screen}>
            <h1 className={styles.title}>{t.level} {level}</h1>
            <p className={styles.description}>{t.score}: {level - 1}</p>
            <button className={styles.button} onClick={handleStart}>{t.tryAgain}</button>
          </div>
        );
      default:
        return null;
    }
  };

  return <div className={styles.container}>{renderContent()}</div>;
}

export default SequenceMemoryTest;
