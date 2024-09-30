import React from 'react';

type MazeCell = 0 | 1 | 'S' | 'F';

interface Position {
  row: number;
  col: number;
}

interface MinigameProps {
  mazeMatrix: MazeCell[][];
  position: Position;
  badMoves: number;
  handleButtonClick: (direction: 'down' | 'up' | 'left' | 'right') => void;
}

const Minigame = ({
  mazeMatrix,
  position,
  badMoves,
  handleButtonClick,
}: MinigameProps) => {
  return (
    <div className=" absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] min-w-[250px]">
      <p className='absolute top-[0%] z-10 p-1 ml-6'>Bad Moves: {badMoves}</p>
      <div className="grid grid-cols-9 relative">
        {mazeMatrix.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const cellClass = `w-8 h-8 flex items-center justify-center ${cell === 1 ? 'bg-gray-800' : cell === 0 ? 'bg-white' : cell === 'S' ? 'bg-green-500' : 'bg-blue-500'}`;
            return (
              <div key={`${rowIndex}-${colIndex}`} className={cellClass}>
                {position.row === rowIndex && position.col === colIndex && (
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                )}
              </div>
            );
          }),
        )}
        <div>
          <button
            onClick={() => handleButtonClick('down')}
            className="absolute w-0 h-0 border-l-[40px] border-r-[40px] border-t-[50px] border-t-blue-500 border-l-transparent border-r-transparent left-[50%] top-[110%] translate-x-[-50%] translate-y-[-50%]"
          ></button>
          <button
            onClick={() => handleButtonClick('left')}
            className="absolute w-0 h-0 border-b-[40px] border-r-[40px] border-t-[40px] border-t-transparent border-b-transparent border-r-blue-500 left-[-10%] top-[50%] translate-x-[-50%] translate-y-[-50%]"
          ></button>
          <button
            onClick={() => handleButtonClick('right')}
            className="absolute w-0 h-0 border-b-[40px] border-l-[40px] border-t-[40px] border-t-transparent border-b-transparent border-l-blue-500 left-[110%] top-[50%] translate-x-[-50%] translate-y-[-50%]"
          ></button>
          <button
            onClick={() => handleButtonClick('up')}
            className="absolute w-0 h-0 border-l-[40px] border-r-[40px] border-b-[50px] border-b-blue-500 border-l-transparent border-r-transparent left-[50%] top-[-10%] translate-x-[-50%] translate-y-[-50%]"
          ></button>
        </div>
      </div>
    </div>
  );
};

export default Minigame;
