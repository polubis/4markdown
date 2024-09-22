import React, { useState, useEffect } from 'react';
import Maze from '../components/minigame';

type MazeCell = 0 | 1 | 'S' | 'F';

interface Position {
  row: number;
  col: number;
}

interface MinigameContainerProps {
  onSuccess: () => void;
  onFailure: () => void;
}

const numRows = 9;
const numCols = 9;
const maxBadMoves = 3;

const generateMaze = (rows: number, cols: number): MazeCell[][] => {
  const maze: MazeCell[][] = Array.from({ length: rows }, () => Array(cols).fill(1));
  const start: Position = { row: 1, col: 1 };
  const finish: Position = { row: rows - 2, col: cols - 2 };
  const directions = [{ row: -2, col: 0 }, { row: 2, col: 0 }, { row: 0, col: -2 }, { row: 0, col: 2 }];

  const isInBounds = (row: number, col: number) => row >= 0 && row < rows && col >= 0 && col < cols;

  const carvePath = (start: Position) => {
    const frontier: Position[] = [start];

    while (frontier.length > 0) {
      const currentIdx = Math.floor(Math.random() * frontier.length);
      const current = frontier.splice(currentIdx, 1)[0];
      maze[current.row][current.col] = 0;

      directions.sort(() => Math.random() - 0.5);
      for (const dir of directions) {
        const newRow = current.row + dir.row;
        const newCol = current.col + dir.col;
        const betweenRow = current.row + dir.row / 2;
        const betweenCol = current.col + dir.col / 2;

        if (isInBounds(newRow, newCol) && maze[newRow][newCol] === 1 && maze[betweenRow][betweenCol] === 1) {
          maze[betweenRow][betweenCol] = 0;
          maze[newRow][newCol] = 0;
          frontier.push({ row: newRow, col: newCol });
        }
      }
    }
  };

  carvePath(start);
  maze[start.row][start.col] = 'S';
  maze[finish.row][finish.col] = 'F';
  return maze;
};

const MinigameContainer: React.FC<MinigameContainerProps> = ({ onSuccess, onFailure }) => {
  const [mazeMatrix, setMazeMatrix] = useState(generateMaze(numRows, numCols));
  const [position, setPosition] = useState<Position>({ row: 1, col: 1 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [badMoves, setBadMoves] = useState(0);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isGameOver) return;
      const moves: Record<string, Position> = {
        ArrowUp: { row: position.row - 1, col: position.col },
        ArrowDown: { row: position.row + 1, col: position.col },
        ArrowLeft: { row: position.row, col: position.col - 1 },
        ArrowRight: { row: position.row, col: position.col + 1 },
      };

      const newPosition = moves[event.key];
      if (newPosition && mazeMatrix[newPosition.row][newPosition.col] !== 1) {
        setPosition(newPosition);
        if (mazeMatrix[newPosition.row][newPosition.col] === 'F') {
          setIsGameOver(true);
          onSuccess();
        }
      } else {
        setBadMoves((prev) => prev + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameOver, mazeMatrix, position, onSuccess]);

  useEffect(() => {
    if (badMoves >= maxBadMoves && !isGameOver) {
      setIsGameOver(true);
      onFailure();
    }
  }, [badMoves, isGameOver, onFailure]);

  const handleButtonClick = (direction: 'down' | 'up' | 'left' | 'right') => {
    if (isGameOver) return;
    const moves: Record<string, Position> = {
      down: { row: position.row + 1, col: position.col },
      up: { row: position.row - 1, col: position.col },
      left: { row: position.row, col: position.col - 1 },
      right: { row: position.row, col: position.col + 1 },
    };

    const newPosition = moves[direction];
    if (mazeMatrix[newPosition.row][newPosition.col] !== 1) {
      setPosition(newPosition);
      if (mazeMatrix[newPosition.row][newPosition.col] === 'F') {
        setIsGameOver(true);
        onSuccess();
      }
    } else {
      setBadMoves((prev) => prev + 1);
    }
  };

  return (
    <div>
      <Maze mazeMatrix={mazeMatrix} position={position} badMoves={badMoves} handleButtonClick={handleButtonClick} />
    </div>
  );
};

export default MinigameContainer;
