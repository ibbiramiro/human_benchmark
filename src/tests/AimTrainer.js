import React, { useState, useEffect, useContext, useRef } from 'react';
import styles from '../styles/AimTrainer.module.css';
import { LanguageContext } from '../contexts/LanguageContext';
import { translations } from '../translations';

const TOTAL_TARGETS = 30;

function AimTrainer() {
  const [status, setStatus] = useState('intro'); // intro, playing, result
  const [targetsLeft, setTargetsLeft] = useState(TOTAL_TARGETS);
  const [targetPosition, setTargetPosition] = useState({ top: '50%', left: '50%' });
  const [averageTime, setAverageTime] = useState(0);
  const startTimeRef = useRef(0);
  const { language } = useContext(LanguageContext);
  const t = translations[language];

  const generateRandomPosition = () => {
    const x = Math.floor(Math.random() * 90) + 5; // 5% to 95%
    const y = Math.floor(Math.random() * 90) + 5;
    setTargetPosition({ top: `${y}%`, left: `${x}%` });
  };

  const handleTargetClick = () => {
    if (status === 'intro') {
      startTimeRef.current = Date.now();
      setStatus('playing');
    }

    if (targetsLeft > 1) {
      setTargetsLeft(targetsLeft - 1);
      generateRandomPosition();
    } else {
      const endTime = Date.now();
      const totalTime = endTime - startTimeRef.current;
      setAverageTime(totalTime / TOTAL_TARGETS);
      setStatus('result');
    }
  };

  const handleRestart = () => {
    setTargetsLeft(TOTAL_TARGETS);
    setAverageTime(0);
    setTargetPosition({ top: '50%', left: '50%' });
    setStatus('intro');
  };

  const renderContent = () => {
    switch (status) {
      case 'intro':
        return (
          <div className={styles.screen}>
            <h1 className={styles.title}>{t.aimTrainerTitle}</h1>
            <div className={styles.target} style={targetPosition} onClick={handleTargetClick} />
            <p className={styles.description}>{t.aimTrainerInstruction}</p>
            <p className={styles.description}>{t.clickTargetToBegin}</p>
          </div>
        );
      case 'playing':
        return (
          <div className={styles.gameArea}>
            <div className={styles.statusBar}>{t.remaining}: {targetsLeft}</div>
            <div className={styles.target} style={targetPosition} onClick={handleTargetClick} />
          </div>
        );
      case 'result':
        return (
          <div className={styles.screen}>
            <h1 className={styles.title}>{Math.round(averageTime)} ms</h1>
            <p className={styles.description}>Average time per target</p>
            <button className={styles.button} onClick={handleRestart}>{t.tryAgain}</button>
          </div>
        );
      default:
        return null;
    }
  };

  return <div className={styles.container}>{renderContent()}</div>;
}

export default AimTrainer;
