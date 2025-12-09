import React, { useState } from 'react';
import './App.css';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import ReactionTimeTest from './tests/ReactionTimeTest';
import ChimpTest from './tests/ChimpTest';

function MainApp() {
  const [currentPage, setCurrentPage] = useState('home');

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
      default:
        return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="app">
      <nav className="nav">
        <div className="nav-left">
          <button 
            className="nav-brand" 
            onClick={() => setCurrentPage('home')}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            HUMAN BENCHMARK
          </button>
          <button 
            className="nav-link"
            onClick={() => setCurrentPage('dashboard')}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            DASHBOARD
          </button>
        </div>
        <div className="nav-right">
          <button className="nav-button" type="button">
            SIGN UP
          </button>
          <button className="nav-button" type="button">
            LOGIN
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
