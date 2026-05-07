import React from "react";
import { Button } from "design-system/button";
import { c } from "design-system/c";
import { Empty } from "design-system/empty";
import { Modal2 } from "design-system/modal2";
import {
  BiDownArrowAlt,
  BiLeftArrowAlt,
  BiRightArrowAlt,
  BiUpArrowAlt,
} from "react-icons/bi";

type Direction = "up" | "down" | "left" | "right";

type Position = {
  x: number;
  y: number;
};

type SnakeProps = {
  pointsToFinish: number;
  closable?: boolean;
  speedBoostFactor?: number;
  onWin(): void;
  onClose?(): void;
  onLost?(): void;
};

const BOARD_SIZE = 20;
const INITIAL_SNAKE: Position[] = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
];
const BASE_TICK_MS = 220;

const getRandomFood = (snake: Position[]): Position => {
  const occupied = new Set(snake.map((part) => `${part.x}:${part.y}`));
  const freeCells: Position[] = [];

  for (let y = 0; y < BOARD_SIZE; y += 1) {
    for (let x = 0; x < BOARD_SIZE; x += 1) {
      const key = `${x}:${y}`;
      if (!occupied.has(key)) {
        freeCells.push({ x, y });
      }
    }
  }

  if (freeCells.length === 0) {
    return { x: 0, y: 0 };
  }

  return freeCells[Math.floor(Math.random() * freeCells.length)];
};

const isOppositeDirection = (from: Direction, to: Direction): boolean => {
  return (
    (from === "up" && to === "down") ||
    (from === "down" && to === "up") ||
    (from === "left" && to === "right") ||
    (from === "right" && to === "left")
  );
};

const DirectionControlButton = ({
  label,
  onClick,
}: {
  label: "Up" | "Down" | "Left" | "Right";
  onClick(): void;
}) => {
  return (
    <Button
      type="button"
      i={2}
      s={2}
      title={label}
      aria-label={`${label} direction`}
      className="h-14 w-14 text-xl font-semibold touch-manipulation"
      onClick={onClick}
    >
      {label === "Up" && <BiUpArrowAlt aria-hidden="true" />}
      {label === "Down" && <BiDownArrowAlt aria-hidden="true" />}
      {label === "Left" && <BiLeftArrowAlt aria-hidden="true" />}
      {label === "Right" && <BiRightArrowAlt aria-hidden="true" />}
    </Button>
  );
};

const Snake = ({
  pointsToFinish,
  closable = true,
  speedBoostFactor = 0.2,
  onWin,
  onClose,
  onLost,
}: SnakeProps) => {
  const [snake, setSnake] = React.useState<Position[]>(INITIAL_SNAKE);
  const [direction, setDirection] = React.useState<Direction>("right");
  const [food, setFood] = React.useState<Position>(() =>
    getRandomFood(INITIAL_SNAKE),
  );
  const [isStarted, setIsStarted] = React.useState(false);
  const [isFinished, setIsFinished] = React.useState(false);
  const directionRef = React.useRef<Direction>("right");
  const finishedRef = React.useRef(false);

  const points = Math.max(0, snake.length - INITIAL_SNAKE.length);

  const updateDirection = React.useCallback(
    (nextDirection: Direction): void => {
      const currentDirection = directionRef.current;
      if (isOppositeDirection(currentDirection, nextDirection)) return;

      directionRef.current = nextDirection;
      setDirection(nextDirection);
    },
    [],
  );

  const closeGame = React.useCallback(() => {
    if (!closable || finishedRef.current) return;

    finishedRef.current = true;
    setIsFinished(true);
    onClose?.();
  }, [closable, onClose]);

  const finishWin = React.useCallback(() => {
    if (finishedRef.current) return;

    finishedRef.current = true;
    setIsFinished(true);
    onWin();
  }, [onWin]);

  const finishLose = React.useCallback(() => {
    if (finishedRef.current) return;

    finishedRef.current = true;
    setIsFinished(true);
    onLost?.();
  }, [onLost]);

  React.useEffect(() => {
    if (isFinished || !isStarted) return;

    const onKeyDown = (event: KeyboardEvent): void => {
      const key = event.key.toLowerCase();
      let nextDirection: Direction | null = null;

      if (key === "arrowup" || key === "w") nextDirection = "up";
      if (key === "arrowdown" || key === "s") nextDirection = "down";
      if (key === "arrowleft" || key === "a") nextDirection = "left";
      if (key === "arrowright" || key === "d") nextDirection = "right";

      if (!nextDirection) return;

      event.preventDefault();
      updateDirection(nextDirection);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isFinished, isStarted, updateDirection]);

  React.useEffect(() => {
    if (isFinished || !isStarted) return;

    const speedMultiplier = 1 + points * Math.max(0, speedBoostFactor);
    const tickMs = Math.max(45, Math.round(BASE_TICK_MS / speedMultiplier));

    const id = window.setInterval(() => {
      setSnake((currentSnake) => {
        const head = currentSnake[0];
        const activeDirection = directionRef.current;
        const nextHead: Position = { ...head };

        if (activeDirection === "up") nextHead.y -= 1;
        if (activeDirection === "down") nextHead.y += 1;
        if (activeDirection === "left") nextHead.x -= 1;
        if (activeDirection === "right") nextHead.x += 1;

        if (
          nextHead.x < 0 ||
          nextHead.y < 0 ||
          nextHead.x >= BOARD_SIZE ||
          nextHead.y >= BOARD_SIZE
        ) {
          finishLose();
          return currentSnake;
        }

        const bodyCollision = currentSnake.some(
          (part) => part.x === nextHead.x && part.y === nextHead.y,
        );

        if (bodyCollision) {
          finishLose();
          return currentSnake;
        }

        const isFoodEaten = nextHead.x === food.x && nextHead.y === food.y;
        const nextSnake = isFoodEaten
          ? [nextHead, ...currentSnake]
          : [nextHead, ...currentSnake.slice(0, -1)];

        if (isFoodEaten) {
          const gainedPoints = nextSnake.length - INITIAL_SNAKE.length;

          if (gainedPoints >= pointsToFinish) {
            finishWin();
          } else {
            setFood(getRandomFood(nextSnake));
          }
        }

        return nextSnake;
      });
    }, tickMs);

    return () => window.clearInterval(id);
  }, [
    food,
    finishLose,
    finishWin,
    isFinished,
    isStarted,
    points,
    pointsToFinish,
    speedBoostFactor,
  ]);

  if (isFinished) return null;

  return (
    <Modal2
      disabled={!closable}
      onClose={closeGame}
      className={c(
        "p-0 items-stretch sm:items-stretch sm:py-0 [overscroll-behavior:contain]",
        "[&>*]:w-full [&>*]:max-w-none [&>*]:h-full [&>*]:rounded-none",
      )}
      data-testid="[snake-game]:modal"
    >
      <Modal2.Header
        title="Challenge"
        closeButtonTitle="Close snake game"
        skipX={!closable}
        className="bg-zinc-100 dark:bg-zinc-950"
      />
      <Modal2.Body className="p-0 bg-zinc-50 dark:bg-black [overscroll-behavior:contain]">
        {isStarted ? (
          <div className="h-full w-full flex flex-col">
            <div className="flex-1 grid place-items-center p-3 sm:p-6">
              <div className="w-full max-w-[780px] max-h-full">
                <p className="mb-2 text-xs text-zinc-600 dark:text-zinc-300">
                  Required to finish: {Math.max(pointsToFinish - points, 0)}
                </p>
                <div
                  className="grid w-full aspect-square rounded-md overflow-hidden border border-zinc-300 dark:border-zinc-700 bg-zinc-200 dark:bg-zinc-900"
                  style={{
                    gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))`,
                    gridTemplateRows: `repeat(${BOARD_SIZE}, minmax(0, 1fr))`,
                  }}
                >
                  {Array.from(
                    { length: BOARD_SIZE * BOARD_SIZE },
                    (_, index) => {
                      const x = index % BOARD_SIZE;
                      const y = Math.floor(index / BOARD_SIZE);
                      const isHead = snake[0]?.x === x && snake[0]?.y === y;
                      const isBody = snake.some(
                        (part, partIndex) =>
                          partIndex > 0 && part.x === x && part.y === y,
                      );
                      const isFood = food.x === x && food.y === y;

                      return (
                        <div
                          key={`${x}:${y}`}
                          className={c(
                            "border-[0.5px] border-zinc-300/50 dark:border-zinc-700/40",
                            isHead && "bg-emerald-600 dark:bg-emerald-500",
                            isBody && "bg-emerald-400 dark:bg-emerald-700",
                            isFood && "bg-red-500 dark:bg-red-600",
                          )}
                        />
                      );
                    },
                  )}
                </div>
              </div>
            </div>
            <div className="md:hidden border-t border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              <div className="mx-auto grid w-fit grid-cols-3 grid-rows-2 gap-2">
                <div />
                <DirectionControlButton
                  label="Up"
                  onClick={() => updateDirection("up")}
                />
                <div />
                <DirectionControlButton
                  label="Left"
                  onClick={() => updateDirection("left")}
                />
                <DirectionControlButton
                  label="Down"
                  onClick={() => updateDirection("down")}
                />
                <DirectionControlButton
                  label="Right"
                  onClick={() => updateDirection("right")}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full w-full grid place-items-center p-4 sm:p-6">
            <Empty
              id="snake-start-empty-state"
              className="w-full max-w-md rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-5 sm:p-6"
            >
              <Empty.Icon>
                <BiRightArrowAlt size={80} />
              </Empty.Icon>
              <Empty.Title
                id="snake-start-empty-title"
                className="text-black dark:text-white text-pretty"
              >
                Ready to start?
              </Empty.Title>
              <Empty.Description
                aria-describedby="snake-start-empty-title"
                className="mt-2 mb-4 text-zinc-600 dark:text-zinc-300"
              >
                Reach {pointsToFinish} points to unlock voting.
              </Empty.Description>
              <Empty.Action
                auto
                type="button"
                i={2}
                s={2}
                onClick={() => setIsStarted(true)}
              >
                Start Game
              </Empty.Action>
            </Empty>
          </div>
        )}
      </Modal2.Body>
    </Modal2>
  );
};

export type { SnakeProps };
export { Snake };
