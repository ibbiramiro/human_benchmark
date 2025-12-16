import React, { useState, useContext } from 'react';
import './App.css';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import ReactionTimeTest from './tests/ReactionTimeTest';
import ChimpTest from './tests/ChimpTest';
import SequenceMemoryTest from './tests/SequenceMemoryTest';
import AimTrainer from './tests/AimTrainer';
import NumberMemoryTest from './tests/NumberMemoryTest';
import VerbalMemoryTest from './tests/VerbalMemoryTest';
import { ThemeContext } from './contexts/ThemeContext';
import { LanguageContext } from './contexts/LanguageContext';
import { translations } from './translations';

function MainApp() {
  const [currentPage, setCurrentPage] = useState('home');
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { language, toggleLanguage } = useContext(LanguageContext);

  const t = translations[language];

  const renderPage = () => {
    switch(currentPage) {
      case 'home':
        return <HomePage setCurrentPage={setCurrentPage} />;
      case 'dashboard':
        return <DashboardPage />;
      case 'reactiontime':
        return <ReactionTimeTest />;
      case 'chimp':
        return <ChimpTest />;
      case 'sequencememory':
        return <SequenceMemoryTest />;
      case 'aimtrainer':
        return <AimTrainer />;
      case 'numbermemory':
        return <NumberMemoryTest />;
      case 'verbalmemory':
        return <VerbalMemoryTest />;
      default:
        return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className={`app ${theme}`}>
      <nav className="nav">
        <div className="nav-left">
          <button 
            className="nav-brand" 
            onClick={() => setCurrentPage('home')}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {t.brand}
          </button>
          <button 
            className="nav-link"
            onClick={() => setCurrentPage('dashboard')}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {t.dashboard}
          </button>
        </div>
        <div className="nav-right">
          <button className="nav-button" type="button" onClick={toggleTheme}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button className="nav-button" type="button" onClick={toggleLanguage}>
            {language.toUpperCase()}
          </button>
          <button className="nav-button" type="button">
            {t.signup}
          </button>
          <button className="nav-button" type="button">
            {t.login}
          </button>
        </div>
      </nav>
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default MainApp;
