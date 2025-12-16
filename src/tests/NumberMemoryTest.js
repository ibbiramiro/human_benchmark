import React, { useState, useEffect, useContext } from 'react';
import styles from '../styles/NumberMemoryTest.module.css';
import { LanguageContext } from '../contexts/LanguageContext';
import { translations } from '../translations';

function NumberMemoryTest() {
  const [status, setStatus] = useState('intro'); // intro, showing, input, result
  const [level, setLevel] = useState(1);
  const [currentNumber, setCurrentNumber] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const { language } = useContext(LanguageContext);
  const t = translations[language];

  const generateNumber = (length) => {
    let num = '';
    for (let i = 0; i < length; i++) {
      num += Math.floor(Math.random() * 10);
    }
    return num;
  };

  const startLevel = () => {
    const newNumber = generateNumber(level);
    setCurrentNumber(newNumber);
    setInputValue('');
    setStatus('showing');

    setTimeout(() => {
      setStatus('input');
    }, 1000 + level * 500); // Show number for longer as it gets longer
  };

  const handleStart = () => {
    setLevel(1);
    startLevel();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue === currentNumber) {
      setIsCorrect(true);
      setLevel(level + 1);
    } else {
      setIsCorrect(false);
    }
    setStatus('result');
  };

  const handleNext = () => {
    startLevel();
  };

  useEffect(() => {
    if (level > 1 && isCorrect) {
        startLevel();
    }
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [level, isCorrect]);


  const renderContent = () => {
    switch (status) {
      case 'intro':
        return (
          <div className={styles.screen}>
            <h1 className={styles.title}>{t.numberMemoryTitle}</h1>
            <p className={styles.description}>{t.numberMemoryInstruction}</p>
            <button className={styles.button} onClick={handleStart}>{t.start}</button>
          </div>
        );
      case 'showing':
        return (
          <div className={styles.screen}>
            <div className={styles.numberDisplay}>{currentNumber}</div>
          </div>
        );
      case 'input':
        return (
          <div className={styles.screen}>
            <h2 className={styles.title}>{t.whatWasTheNumber}</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                className={styles.input}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                autoFocus
              />
              <p className={styles.description}>{t.pressEnterToSubmit}</p>
              <button type="submit" className={styles.button}>{t.submit}</button>
            </form>
          </div>
        );
      case 'result':
        return (
          <div className={styles.screen}>
            {isCorrect ? (
              <>
                <h1 className={styles.title}>{t.score}: {level -1}</h1>
                <button className={styles.button} onClick={handleNext}>{t.next}</button>
              </>
            ) : (
              <>
                <h1 className={styles.title}>{t.score}: {level - 1}</h1>
                <p className={styles.description}>The number was {currentNumber}</p>
                <button className={styles.button} onClick={handleStart}>{t.tryAgain}</button>
              </>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return <div className={styles.container}>{renderContent()}</div>;
}

export default NumberMemoryTest;
