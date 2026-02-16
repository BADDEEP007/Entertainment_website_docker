import React, { useState } from 'react';
import PacMan from './PacMan';
import Ghost from './Ghost';

const GameBoard = () => {
  const [pacManPosition, setPacManPosition] = useState({ x: 0, y: 0 });
  const [ghostPositions, setGhostPositions] = useState([
    { direction: 'right', position: { x: 1, y: 0 } },
    // Add more ghosts as needed
  ]);

  const movePacMan = (newX, newY) => {
    setPacManPosition({ x: newX, y: newY });
  };

  return (
    <div className="game-board">
      {ghostPositions.map((ghost, index) => (
        <Ghost key={index} direction={ghost.direction} />
      ))}
      <PacMan position={pacManPosition} />
    </div>
  );
};

export default GameBoard;