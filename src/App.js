import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [gameState, setGameState] = useState('start'); // start, playing, sequence, input, gameover
  const [level, setLevel] = useState(1);
  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [showingSequence, setShowingSequence] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('chimpsHighScore') || '1');
  });

  const generateSequence = (length) => {
    const newSequence = [];
    for (let i = 0; i < length; i++) {
      newSequence.push(Math.floor(Math.random() * 9) + 1);
    }
    return newSequence;
  };

  const startTest = () => {
    setGameState('playing');
    setLevel(1);
    setUserSequence([]);
    const newSequence = generateSequence(1);
    setSequence(newSequence);
    setTimeout(() => {
      showSequence(newSequence);
    }, 500);
  };

  const showSequence = (seq) => {
    setGameState('sequence');
    setShowingSequence(true);
    
    seq.forEach((num, index) => {
      setTimeout(() => {
        // Highlight the number
        const element = document.getElementById(`seq-${index}`);
        if (element) {
          element.style.opacity = '1';
        }
        
        if (index === seq.length - 1) {
          setTimeout(() => {
            setShowingSequence(false);
            setGameState('input');
          }, 1000);
        }
      }, index * 1000);
    });
  };

  const handleNumberClick = (number) => {
    if (gameState !== 'input' || showingSequence) return;

    const newUserSequence = [...userSequence, number];
    setUserSequence(newUserSequence);

    // Check if correct
    if (newUserSequence[newUserSequence.length - 1] !== sequence[newUserSequence.length - 1]) {
      // Wrong answer
      setGameState('gameover');
      if (level > highScore) {
        setHighScore(level);
        localStorage.setItem('chimpsHighScore', level.toString());
      }
      return;
    }

    // Check if sequence complete
    if (newUserSequence.length === sequence.length) {
      // Correct sequence complete
      setTimeout(() => {
        const nextLevel = level + 1;
        setLevel(nextLevel);
        const newSequence = generateSequence(nextLevel);
        setSequence(newSequence);
        setUserSequence([]);
        showSequence(newSequence);
      }, 1000);
    }
  };

  const restartTest = () => {
    setGameState('start');
    setLevel(1);
    setSequence([]);
    setUserSequence([]);
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  return (
    <div className="app">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-left">
          <a href="#" className="nav-brand">HUMAN BENCHMARK</a>
          <a href="#" className="nav-link">DASHBOARD</a>
        </div>
        <div className="nav-right">
          <a href="#" className="nav-link">SIGN UP</a>
          <a href="#" className="nav-link">LOGIN</a>
        </div>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        {gameState === 'start' && (
          <div className="start-screen">
            <div className="icon-container">
              <div className="grid-icon">
                <div className="grid-square"></div>
                <div className="grid-square"></div>
                <div className="grid-square"></div>
                <div className="grid-square outlined"></div>
              </div>
            </div>
            <h1 className="title">Are You Smarter Than a Chimpanzee?</h1>
            <p className="description">
              Click the squares in order according to their numbers. The test will get progressively harder.
            </p>
            <button className="start-btn" onClick={startTest}>
              START TEST
            </button>
            {highScore > 1 && (
              <div className="high-score">
                High Score: Level {highScore}
              </div>
            )}
          </div>
        )}

        {gameState === 'playing' && (
          <div className="game-screen">
            <div className="level-indicator">
              Level {level}
            </div>
            
            {gameState === 'sequence' && (
              <div className="sequence-display">
                {sequence.map((num, index) => (
                  <div
                    key={index}
                    id={`seq-${index}`}
                    className="sequence-number"
                    style={{ opacity: 0 }}
                  >
                    {num}
                  </div>
                ))}
              </div>
            )}

            {gameState === 'input' && (
              <div className="game-grid">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    className={`grid-cell ${userSequence.includes(num) ? 'clicked' : ''}`}
                    onClick={() => handleNumberClick(num)}
                    disabled={userSequence.includes(num)}
                  >
                    {num}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {gameState === 'sequence' && (
          <div className="game-screen">
            <div className="level-indicator">
              Level {level}
            </div>
            <div className="sequence-display">
              {sequence.map((num, index) => (
                <div
                  key={index}
                  id={`seq-${index}`}
                  className="sequence-number"
                  style={{ opacity: 0 }}
                >
                  {num}
                </div>
              ))}
            </div>
          </div>
        )}

        {gameState === 'input' && (
          <div className="game-screen">
            <div className="level-indicator">
              Level {level}
            </div>
            <div className="game-grid">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  className={`grid-cell ${userSequence.includes(num) ? 'clicked' : ''}`}
                  onClick={() => handleNumberClick(num)}
                  disabled={userSequence.includes(num)}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="gameover-screen">
            <h2 className="gameover-title">Test Complete</h2>
            <p className="gameover-message">
              You reached level {level}
              {level > highScore - 1 && ' - New High Score!'}
            </p>
            <button className="restart-btn" onClick={restartTest}>
              TRY AGAIN
            </button>
          </div>
        )}
      </div>

      {/* Sound Control */}
      <button className="sound-toggle" onClick={toggleSound}>
        {soundEnabled ? '🔊' : '🔇'}
      </button>
    </div>
  );
}

export default App;
