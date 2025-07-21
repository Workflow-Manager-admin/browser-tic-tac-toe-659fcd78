import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

// PUBLIC_INTERFACE
const Cell = ({ type }) => (
  <div className={`cell ${type}`} />
);

// PUBLIC_INTERFACE
const GameBoard = ({ snake, food }) => {
  const board = Array(20).fill().map(() => Array(20).fill('empty'));
  
  snake.forEach(([x, y]) => {
    if (x >= 0 && x < 20 && y >= 0 && y < 20) {
      board[y][x] = 'snake';
    }
  });
  
  if (food && food[0] >= 0 && food[0] < 20 && food[1] >= 0 && food[1] < 20) {
    board[food[1]][food[0]] = 'food';
  }

  return (
    <div className="game-board">
      {board.flat().map((cellType, index) => (
        <Cell key={index} type={cellType} />
      ))}
    </div>
  );
};

// PUBLIC_INTERFACE
function App() {
  const [snake, setSnake] = useState([[10, 10]]); // Start in middle
  const [food, setFood] = useState([5, 5]);
  const [direction, setDirection] = useState('RIGHT');
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const generateFood = useCallback(() => {
    let newFood;
    do {
      newFood = [
        Math.floor(Math.random() * 20),
        Math.floor(Math.random() * 20)
      ];
    } while (snake.some(([x, y]) => x === newFood[0] && y === newFood[1]));
    setFood(newFood);
  }, [snake]);

  const resetGame = () => {
    setSnake([[10, 10]]);
    setDirection('RIGHT');
    setIsGameOver(false);
    setScore(0);
    setGameStarted(false);
    generateFood();
  };

  const checkCollision = useCallback((head) => {
    // Wall collision
    if (head[0] < 0 || head[0] >= 20 || head[1] < 0 || head[1] >= 20) {
      return true;
    }
    // Self collision
    return snake.slice(1).some(([x, y]) => x === head[0] && y === head[1]);
  }, [snake]);

  const moveSnake = useCallback(() => {
    if (isGameOver || !gameStarted) return;

    const newSnake = [...snake];
    const head = [...newSnake[0]];

    switch (direction) {
      case 'UP': head[1] -= 1; break;
      case 'DOWN': head[1] += 1; break;
      case 'LEFT': head[0] -= 1; break;
      case 'RIGHT': head[0] += 1; break;
      default: break;
    }

    if (checkCollision(head)) {
      setIsGameOver(true);
      return;
    }

    newSnake.unshift(head);

    if (head[0] === food[0] && head[1] === food[1]) {
      setScore(prev => prev + 1);
      generateFood();
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [snake, direction, food, isGameOver, gameStarted, checkCollision, generateFood]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!gameStarted && !isGameOver && e.key.includes('Arrow')) {
        setGameStarted(true);
      }

      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameStarted, isGameOver]);

  useEffect(() => {
    const gameLoop = setInterval(moveSnake, 150);
    return () => clearInterval(gameLoop);
  }, [moveSnake]);

  return (
    <div className="App">
      <div className="game-container">
        <div className="game-status">
          <div>Score: {score}</div>
          {!gameStarted && !isGameOver && (
            <div>Press any arrow key to start</div>
          )}
          {isGameOver && (
            <div className="game-over">Game Over!</div>
          )}
        </div>

        <GameBoard snake={snake} food={food} />

        <div className="controls">
          <button className="reset-button" onClick={resetGame}>
            Reset Game
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
