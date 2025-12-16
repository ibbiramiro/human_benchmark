import React, { useEffect, useRef, useState, useContext } from 'react';
import styles from '../styles/ReactionTimeTest.module.css';
import { LanguageContext } from '../contexts/LanguageContext';
import { translations } from '../translations';

const MIN_DELAY = 2000;
const MAX_DELAY = 5000;

function ReactionTimeTest() {
  const [status, setStatus] = useState('intro'); // intro, waiting, ready, result, tooSoon
  const [reactionTime, setReactionTime] = useState(null);
  const timeoutRef = useRef(null);
  const startTimeRef = useRef(0);
  const { language } = useContext(LanguageContext);
  const t = translations[language];

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const scheduleGreen = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    const delay = MIN_DELAY + Math.random() * (MAX_DELAY - MIN_DELAY);
    timeoutRef.current = setTimeout(() => {
      startTimeRef.current = performance.now();
      setStatus('ready');
    }, delay);
  };

  const startRound = () => {
    setReactionTime(null);
    setStatus('waiting');
    scheduleGreen();
  };

  const handlePanelClick = () => {
    if (status === 'intro' || status === 'result') {
      startRound();
      return;
    }

    if (status === 'waiting') {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setStatus('tooSoon');
      return;
    }

    if (status === 'ready') {
      const rt = Math.round(performance.now() - startTimeRef.current);
      setReactionTime(rt);
      setStatus('result');
      return;
    }

    if (status === 'tooSoon') {
      startRound();
    }
  };

  const backgroundClass = () => {
    if (status === 'waiting') return styles.red;
    if (status === 'ready') return styles.green;
    return styles.blue;
  };

  const renderContent = () => {
    switch (status) {
      case 'intro':
        return (
          <>
            <h1 className={styles.title}>{t.reactionTimeTestTitle}</h1>
            <p className={styles.subtitle}>{t.reactionTimeTestInstruction}</p>
            <p className={styles.subtitle}>{t.clickToStart}</p>
          </>
        );
      case 'waiting':
        return (
          <>
            <div className={styles.ellipsis}>...</div>
            <p className={styles.smallText}>{t.waitForGreen}</p>
          </>
        );
      case 'ready':
        return <div className={styles.clickText}>{t.click}</div>;
      case 'tooSoon':
        return (
          <>
            <h2 className={styles.title}>{t.tooSoon}</h2>
            <p className={styles.subtitle}>{t.clickToTryAgain}</p>
          </>
        );
      case 'result':
        return (
          <>
            <div className={styles.resultTime}>{reactionTime} ms</div>
            <p className={styles.subtitle}>{t.clickToKeepGoing}</p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className={`${styles.panel} ${backgroundClass()}`}
      onClick={handlePanelClick}
    >
      {renderContent()}
    </div>
  );
}

export default ReactionTimeTest;
