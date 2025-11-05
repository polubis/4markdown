import { c } from "design-system/c";
import React from "react";
import Popover from "design-system/popover";
import { useSimpleFeature } from "@greenonsoftware/react-kit";

type JudgeScoreProps = {
  score?: number | null;
  votes?: number | null;
  className?: string;
  children?: React.ReactNode;
  onRate?: (rate: number) => void;
} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const getGradientClasses = (score: number): string => {
  if (score === 0) {
    return "bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800";
  }

  const normalizedScore = Math.max(0, Math.min(10, score));

  if (normalizedScore <= 2) {
    return "bg-gradient-to-r from-red-400 via-red-300 to-orange-400 dark:from-red-900 dark:via-red-800 dark:to-orange-900";
  } else if (normalizedScore <= 4) {
    return "bg-gradient-to-r from-red-300 via-orange-400 to-orange-300 dark:from-red-800 dark:via-orange-900 dark:to-orange-800";
  } else if (normalizedScore <= 6) {
    return "bg-gradient-to-r from-orange-300 via-yellow-300 to-yellow-200 dark:from-orange-800 dark:via-amber-800 dark:to-yellow-700";
  } else if (normalizedScore <= 8) {
    return "bg-gradient-to-r from-yellow-300 via-lime-300 to-green-400 dark:from-yellow-700 dark:via-lime-700 dark:to-green-800";
  } else {
    return "bg-gradient-to-r from-green-400 via-green-300 to-emerald-400 dark:from-green-800 dark:via-green-700 dark:to-emerald-800";
  }
};

const JudgeScore = ({
  score,
  votes,
  className,
  children,
  onRate,
  type = "button",
  onClick,
  ...props
}: JudgeScoreProps) => {
  const panel = useSimpleFeature();
  const finalScore = score ?? 0;
  const gradientClasses = getGradientClasses(finalScore);
  const displayText = finalScore === 0 ? "N/A" : `${finalScore}/10`;
  const finalVotes = votes ?? 0;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    panel.on();
    onClick?.(e);
  };

  const handleRateClick = (rate: number) => {
    onRate?.(rate);
    panel.off();
  };

  return (
    <div className="relative">
      <button
        type={type}
        className={c(
          "relative p-2 rounded-lg",
          "enabled:focus:outline dark:outline-2 outline-2.5 outline-black dark:outline-white",
          "enabled:hover:bg-black/10 dark:enabled:hover:bg-white/10",
          "disabled:cursor-not-allowed",
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
          className="!absolute flex flex-wrap gap-2 justify-center max-w-[40rem] w-full translate-y-2.5 -translate-x-1/2 left-1/2"
          onBackdropClick={panel.off}
        >
          {Array.from({ length: 10 }, (_, i) => {
            const rate = i + 1;
            const rateGradientClasses = getGradientClasses(rate);
            return (
              <button
                key={rate}
                type="button"
                onClick={() => handleRateClick(rate)}
                className={c(
                  "w-10 h-10 rounded-lg",
                  "font-bold text-sm leading-none",
                  "text-black dark:text-white",
                  "enabled:focus:outline dark:outline-2 outline-2.5 outline-black dark:outline-white",
                  "enabled:hover:bg-black/20 dark:enabled:hover:bg-white/20",
                  "transition-colors",
                  rateGradientClasses,
                  "animate-gradient-move bg-[length:200%_200%]",
                )}
              >
                {rate}
              </button>
            );
          })}
        </Popover>
      )}
    </div>
  );
};

export { JudgeScore };
