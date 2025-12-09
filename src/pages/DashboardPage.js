import React from 'react';
import styles from '../styles/HomePage.module.css';

// Simple static dashboard preview page
function DashboardPage() {
  return (
    <div className={styles.heroWrapper}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>
          Sign in to save and compare your scores. This demo dashboard is a
          front-end only replica.
        </p>
        <div className={styles.testsGrid}>
          <div className={styles.testCard}>
            <h3 className={styles.testTitle}>Reaction Time</h3>
            <p className={styles.testDescription}>Best score stored locally.</p>
          </div>
          <div className={styles.testCard}>
            <h3 className={styles.testTitle}>Chimp Test</h3>
            <p className={styles.testDescription}>Beat your previous score.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;
