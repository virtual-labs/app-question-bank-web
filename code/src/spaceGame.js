import React, { useState, useEffect } from 'react';

const SpaceGame = () => {
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timer, setTimer] = useState(null);
  const [rocketPosition, setRocketPosition] = useState(50);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setScore(score => score + 1);
        const newPosition = Math.random() * 100;
        setRocketPosition(newPosition);
      }, 1000);
      setTimer(interval);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const startGame = () => {
    setIsPlaying(true);
  };

  const endGame = () => {
    setIsPlaying(false);
    setScore(0);
  };

  const moveRocket = (direction) => {
    if (isPlaying) {
      let newPosition = rocketPosition;
      if (direction === 'left' && rocketPosition > 0) {
        newPosition -= 5;
      } else if (direction === 'right' && rocketPosition < 100) {
        newPosition += 5;
      }
      setRocketPosition(newPosition);
    }
  };

  return (
    <div style={{ width: '50%', backgroundColor: '#333', color: '#fff', textAlign: 'center', padding: '20px' }}>
      <h2>Space Game</h2>
      <p>Score: {score}</p>
      {!isPlaying ? (
        <button onClick={startGame}>Start Game</button>
      ) : (
        <div>
          <p>Use left and right arrow keys to move the rocket.</p>
          <div style={{ position: 'relative', width: '100%', height: '200px', backgroundColor: '#000' }}>
            <div
              style={{
                position: 'absolute',
                left: `${rocketPosition}%`,
                bottom: '0',
                width: '50px',
                height: '50px',
                backgroundColor: 'red',
              }}
            ></div>
          </div>
          <button onClick={() => moveRocket('left')}>Move Left</button>
          <button onClick={() => moveRocket('right')}>Move Right</button>
          <button onClick={endGame}>End Game</button>
        </div>
      )}
    </div>
  );
};

export default SpaceGame;
