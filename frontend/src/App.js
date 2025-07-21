import React, { useState } from 'react';
import './App.css';

// PUBLIC_INTERFACE
const Square = ({ value, onClick }) => (
  <button className={`square ${value?.toLowerCase()}`} onClick={onClick}>
    {value}
  </button>
);

// PUBLIC_INTERFACE
const Board = ({ squares, onClick }) => (
  <div className="board">
    {squares.map((value, index) => (
      <Square
        key={index}
        value={value}
        onClick={() => onClick(index)}
      />
    ))}
  </div>
);

// PUBLIC_INTERFACE
function App() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (i) => {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    
    const newSquares = squares.slice();
    newSquares[i] = isXNext ? 'X' : 'O';
    setSquares(newSquares);
    setIsXNext(!isXNext);
  };

  const handleReset = () => {
    setSquares(Array(9).fill(null));
    setIsXNext(true);
  };

  const winner = calculateWinner(squares);
  const isDraw = !winner && squares.every(square => square !== null);
  
  let status;
  if (winner) {
    status = <span className="winner">Winner: {winner}</span>;
  } else if (isDraw) {
    status = "Game Draw!";
  } else {
    status = `Current player: ${isXNext ? 'X' : 'O'}`;
  }

  return (
    <div className="App">
      <div className="game-container">
        <div className="player-info">
          <div className={`player ${isXNext && !winner ? 'active' : ''}`}>
            Player X
          </div>
          <div className={`player ${!isXNext && !winner ? 'active' : ''}`}>
            Player O
          </div>
        </div>
        
        <div className="game-status">{status}</div>
        
        <Board squares={squares} onClick={handleClick} />
        
        <div className="controls">
          <button className="reset-button" onClick={handleReset}>
            Reset Game
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
