import React, { useEffect, useRef, useState } from 'react';
import styles from '../styles/ReactionTimeTest.module.css';

const MIN_DELAY = 2000;
const MAX_DELAY = 5000;

// Reaction time test closely mirroring humanbenchmark.com
function ReactionTimeTest() {
  const [status, setStatus] = useState('intro'); // intro, waiting, ready, result, tooSoon
  const [reactionTime, setReactionTime] = useState(null);
  const timeoutRef = useRef(null);
  const startTimeRef = useRef(0);

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
      // Clicked too early
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
    if (status === 'intro') {
      return (
        <>
          <h1 className={styles.title}>Reaction Time Test</h1>
          <p className={styles.subtitle}>
            When the red box turns green, click as quickly as you can.
            <br />
            Click anywhere to start.
          </p>
        </>
      );
    }

    if (status === 'waiting') {
      return (
        <>
          <div className={styles.ellipsis}>...</div>
          <p className={styles.smallText}>Wait for green</p>
        </>
      );
    }

    if (status === 'ready') {
      return <div className={styles.clickText}>Click!</div>;
    }

    if (status === 'tooSoon') {
      return (
        <>
          <div className={styles.resultIcon}>!</div>
          <h2 className={styles.title}>Too soon!</h2>
          <p className={styles.subtitle}>Click to try again.</p>
        </>
      );
    }

    // result
    return (
      <>
        <div className={styles.resultIcon}>🕒</div>
        <div className={styles.resultTime}>{reactionTime} ms</div>
        <p className={styles.subtitle}>Click to keep going.</p>
      </>
    );
  };

  return (
    <div className={styles.wrapper}>
      <div
        className={`${styles.panel} ${backgroundClass()}`}
        onClick={handlePanelClick}
      >
        <div className={styles.content}>{renderContent()}</div>
      </div>
    </div>
  );
}

export default ReactionTimeTest;
