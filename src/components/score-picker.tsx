import { c } from "design-system/c";
import React from "react";
import Popover from "design-system/popover";
import { useSimpleFeature } from "@greenonsoftware/react-kit";
import { playNote } from "development-kit/play-note";
import { Atoms } from "api-4markdown-contracts";

type ScorePickerProps = {
  average?: number | null;
  count?: number | null;
  className?: string;
  popoverClassName?: string;
  children?: React.ReactNode;
  onRate: (score: Atoms["ScoreValue"]) => void;
} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const getGradientClasses = (score: number): string => {
  if (score === 0) {
    return "bg-gradient-to-r from-gray-500 via-gray-400 to-gray-500 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800";
  }

  const normalizedScore = Math.max(0, Math.min(10, score));

  if (normalizedScore <= 2) {
    return "bg-gradient-to-r from-red-600 via-red-500 to-orange-600 dark:from-red-900 dark:via-red-800 dark:to-orange-900";
  } else if (normalizedScore <= 4) {
    return "bg-gradient-to-r from-red-500 via-orange-600 to-orange-500 dark:from-red-800 dark:via-orange-900 dark:to-orange-800";
  } else if (normalizedScore <= 6) {
    return "bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 dark:from-orange-800 dark:via-amber-800 dark:to-yellow-700";
  } else if (normalizedScore <= 8) {
    return "bg-gradient-to-r from-yellow-500 via-lime-500 to-green-600 dark:from-yellow-700 dark:via-lime-700 dark:to-green-800";
  } else {
    return "bg-gradient-to-r from-green-600 via-green-500 to-emerald-600 dark:from-green-800 dark:via-green-700 dark:to-emerald-800";
  }
};

const SCORE_NOTES = [
  "c4",
  "d4",
  "e4",
  "f4",
  "g4",
  "g#4",
  "a4",
  "a#4",
  "b4",
  "c5",
] as const;

const ScorePicker = ({
  average,
  count,
  className,
  popoverClassName,
  children,
  onRate,
  type = "button",
  onClick,
  disabled,
  ...props
}: ScorePickerProps) => {
  const panel = useSimpleFeature();
  const finalScore = average ?? 0;
  const gradientClasses = getGradientClasses(finalScore);
  const displayText = finalScore === 0 ? "N/A" : `${finalScore}/10`;
  const finalVotes = count ?? 0;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    panel.on();
    onClick?.(e);
  };

  const handleRateClick = (score: Atoms["ScoreValue"], index: number) => {
    onRate?.(score);
    playNote(SCORE_NOTES[index]);
    panel.off();
  };

  return (
    <div className="relative">
      <button
        type={type}
        disabled={disabled}
        className={c(
          "relative p-2 rounded-lg",
          "enabled:focus:outline dark:outline-2 outline-2.5 outline-black dark:outline-white",
          "enabled:hover:bg-black/10 dark:enabled:hover:bg-white/10",
          "disabled:cursor-not-allowed disabled:opacity-60",
          "transition-colors",
          gradientClasses,
          "animate-gradient-move bg-[length:200%_200%]",
          className,
        )}
        onClick={handleClick}
        {...props}
      >
        {finalVotes > 0 && (
          <span
            className={c(
              "absolute -top-3.5 -right-2.5",
              "inline-flex items-center justify-center",
              "min-w-6 h-6 px-1.5 rounded-full",
              "text-xs font-bold leading-none",
              "text-black dark:text-white",
              gradientClasses,
              "animate-gradient-move bg-[length:200%_200%]",
              "border-2 border-white dark:border-zinc-900",
            )}
          >
            {finalVotes > 99 ? "99+" : finalVotes}
          </span>
        )}
        <div className="text-center">
          <span className="font-bold text-base leading-none text-black dark:text-white">
            {displayText}
          </span>
        </div>
        {children}
      </button>
      {panel.isOn && (
        <Popover
          className={c(
            "!absolute flex flex-wrap gap-2 justify-center max-w-[40rem] translate-y-2.5",
            popoverClassName,
          )}
          onBackdropClick={panel.off}
        >
          {Array.from({ length: SCORE_NOTES.length }, (_, i) => {
            const score = (i + 1) as Atoms["ScoreValue"];
            const classes = getGradientClasses(score);
            return (
              <button
                key={score}
                type="button"
                onClick={() => handleRateClick(score, i)}
                className={c(
                  "w-10 h-10 rounded-lg",
                  "font-bold text-sm leading-none",
                  "text-black dark:text-white",
                  "enabled:focus:outline dark:outline-2 outline-2.5 outline-black dark:outline-white",
                  "enabled:hover:bg-black/20 dark:enabled:hover:bg-white/20",
                  "transition-colors",
                  classes,
                  "animate-gradient-move bg-[length:200%_200%]",
                )}
              >
                {score}
              </button>
            );
          })}
        </Popover>
      )}
    </div>
  );
};

export { ScorePicker };
