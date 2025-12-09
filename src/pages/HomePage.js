import React from 'react';
import styles from '../styles/HomePage.module.css';

function HomePage({ setCurrentPage }) {
  return (
    <div className={styles.heroWrapper}>
      <section className={styles.hero}>
        <div className={styles.iconRow}>
          <div className={styles.iconCircle}>
            <span className={styles.iconLightning}>⚡</span>
          </div>
        </div>
        <h1 className={styles.title}>Human Benchmark</h1>
        <p className={styles.subtitle}>
          Measure your abilities with brain games and cognitive tests.
        </p>
        <button type="button" onClick={() => setCurrentPage('reactiontime')} className={styles.primaryButton}>
          Get Started
        </button>
        <div className={styles.testsGrid}>
          <button type="button" onClick={() => setCurrentPage('reactiontime')} className={styles.testCard}>
            <h3 className={styles.testTitle}>Reaction Time</h3>
            <p className={styles.testDescription}>How fast can you react?</p>
          </button>
          <button type="button" onClick={() => setCurrentPage('chimp')} className={styles.testCard}>
            <h3 className={styles.testTitle}>Chimp Test</h3>
            <p className={styles.testDescription}>Can you beat a chimpanzee?</p>
          </button>
        </div>
        <div className={styles.adPlaceholder}>Ad placeholder</div>
      </section>
    </div>
  );
}

export default HomePage;
