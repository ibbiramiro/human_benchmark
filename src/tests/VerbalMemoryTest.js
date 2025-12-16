import React, { useState, useEffect, useContext, useMemo } from 'react';
import styles from '../styles/VerbalMemoryTest.module.css';
import { LanguageContext } from '../contexts/LanguageContext';
import { translations } from '../translations';

// A larger word list for a better experience
const WORD_LIST = [
  'apple', 'banana', 'river', 'mountain', 'ocean', 'computer', 'keyboard', 'sunshine', 
  'moonlight', 'galaxy', 'universe', 'melody', 'harmony', 'rhythm', 'symphony', 'sculpture', 
  'painting', 'canvas', 'gallery', 'museum', 'history', 'future', 'present', 'moment', 
  'journey', 'adventure', 'discovery', 'exploration', 'voyage', 'expedition', 'courage', 
  'bravery', 'valor', 'heroism', 'wisdom', 'knowledge', 'insight', 'understanding', 
  'philosophy', 'imagination', 'creativity', 'inspiration', 'genius', 'talent', 'skill',
  'passion', 'emotion', 'feeling', 'spirit', 'soul', 'heart', 'mind', 'body', 'health',
  'wellness', 'fitness', 'strength', 'energy', 'vitality', 'nature', 'forest', 'jungle',
  'desert', 'tundra', 'island', 'continent', 'planet', 'star', 'nebula', 'comet', 'meteor',
  'aurora', 'climate', 'weather', 'season', 'spring', 'summer', 'autumn', 'winter',
  'language', 'grammar', 'syntax', 'vocabulary', 'dialogue', 'conversation', 'communication',
  'science', 'technology', 'engineering', 'mathematics', 'biology', 'chemistry', 'physics'
];

function VerbalMemoryTest() {
  const [status, setStatus] = useState('intro'); // intro, playing, gameover
  const [seenWords, setSeenWords] = useState(new Set());
  const [currentWord, setCurrentWord] = useState('');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const { language } = useContext(LanguageContext);
  const t = translations[language];

  const availableWords = useMemo(() => {
    return WORD_LIST.filter(word => !seenWords.has(word));
  }, [seenWords]);

  const nextWord = () => {
    let word;
    // 30% chance to show a seen word
    if (seenWords.size > 0 && Math.random() < 0.3) {
      const seenArray = Array.from(seenWords);
      word = seenArray[Math.floor(Math.random() * seenArray.length)];
    } else {
      word = availableWords[Math.floor(Math.random() * availableWords.length)];
    }
    setCurrentWord(word);
  };

  const handleStart = () => {
    setStatus('playing');
    setSeenWords(new Set());
    setScore(0);
    setLives(3);
    nextWord();
  };

  useEffect(() => {
    if (status === 'playing' && currentWord === '') {
      nextWord();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, currentWord]);

  const handleChoice = (choice) => { // 'seen' or 'new'
    const hasBeenSeen = seenWords.has(currentWord);
    let correct = false;
    if (choice === 'seen' && hasBeenSeen) {
      correct = true;
    } else if (choice === 'new' && !hasBeenSeen) {
      correct = true;
    }

    if (correct) {
      setScore(score + 1);
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      if (newLives === 0) {
        setStatus('gameover');
        return;
      }
    }

    setSeenWords(prevSeen => new Set(prevSeen).add(currentWord));
    nextWord();
  };

  const renderContent = () => {
    switch (status) {
      case 'intro':
        return (
          <div className={styles.screen}>
            <h1 className={styles.title}>{t.verbalMemoryTitle}</h1>
            <p className={styles.description}>{t.verbalMemoryInstruction}</p>
            <button className={styles.button} onClick={handleStart}>{t.start}</button>
          </div>
        );
      case 'playing':
        return (
          <div className={styles.screen}>
            <div className={styles.statusBar}>
              <span>{t.lives}: {lives}</span>
              <span>{t.score}: {score}</span>
            </div>
            <div className={styles.wordDisplay}>{currentWord}</div>
            <div className={styles.buttonGroup}>
              <button className={styles.button} onClick={() => handleChoice('seen')}>{t.seen}</button>
              <button className={styles.button} onClick={() => handleChoice('new')}>{t.new}</button>
            </div>
          </div>
        );
      case 'gameover':
        return (
          <div className={styles.screen}>
            <h1 className={styles.title}>{t.score}</h1>
            <p className={styles.description}>Your score</p>
            <button className={styles.button} onClick={handleStart}>{t.tryAgain}</button>
          </div>
        );
      default:
        return null;
    }
  };

  return <div className={styles.container}>{renderContent()}</div>;
}

export default VerbalMemoryTest;
