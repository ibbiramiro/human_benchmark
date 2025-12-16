import React, { useContext } from 'react';
import styles from '../styles/HomePage.module.css';
import { LanguageContext } from '../contexts/LanguageContext';
import { translations } from '../translations';

const tests = [
  { id: 'reactiontime', title: 'reactionTime', desc: 'reactionTimeDesc' },
  { id: 'sequencememory', title: 'sequenceMemory', desc: 'sequenceMemoryDesc', isNew: true },
  { id: 'aimtrainer', title: 'aimTrainer', desc: 'aimTrainerDesc', isNew: true },
  { id: 'numbermemory', title: 'numberMemory', desc: 'numberMemoryDesc' },
  { id: 'verbalmemory', title: 'verbalMemory', desc: 'verbalMemoryDesc' },
  { id: 'chimp', title: 'chimpTest', desc: 'chimpTestDesc' },
];

function HomePage({ setCurrentPage }) {
  const { language } = useContext(LanguageContext);
  const t = translations[language];

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>{t.homeTitle}</h1>
        <p className={styles.heroSubtitle}>{t.homeSubtitle}</p>
      </div>
      <div className={styles.testsGrid}>
        {tests.map((test) => (
          <button 
            key={test.id} 
            className={styles.testCard} 
            onClick={() => setCurrentPage(test.id)}
          >
            {test.isNew && <div className={styles.newBadge}>NEW</div>}
            <h3 className={styles.testTitle}>{t[test.title]}</h3>
            <p className={styles.testDescription}>{t[test.desc]}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
