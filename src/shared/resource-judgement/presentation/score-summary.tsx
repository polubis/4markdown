import { c } from "design-system/c";
import React, { type ComponentProps } from "react";
import { BiStar, BiSolidStar, BiUser } from "react-icons/bi";
import {
  formatCompactCount,
  formatScoreAverage,
  MAX_SCORE,
} from "./formatting";
import { useContext } from "./context";

export type ScoreSummaryProps = ComponentProps<"div">;

export const ScoreSummary = ({ className, ...rest }: ScoreSummaryProps) => {
  const { useScore, useMyScore } = useContext();
  const score = useScore();
  const myScore = useMyScore();
  const StarIcon = myScore !== null ? BiSolidStar : BiStar;

  return (
    <div
      {...rest}
      className={c(
        "flex w-fit items-center gap-3 rounded-md border px-2 py-2 shadow-sm",
        "border-zinc-300 bg-zinc-100 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-300",
        className,
      )}
    >
      <div className="flex items-center gap-1.5 rounded-md leading-none">
        <StarIcon
          aria-hidden="true"
          className={c(myScore !== null && "text-amber-500")}
          size={20}
        />
        <strong className="text-sm leading-none tabular-nums">
          {formatScoreAverage(score.average)}
        </strong>
        <span className="text-sm leading-none tabular-nums text-zinc-500 dark:text-zinc-400">
          /{MAX_SCORE}
        </span>
      </div>
      <div className="flex items-center gap-1.5 rounded-md leading-none">
        <BiUser aria-hidden="true" size={20} />
        <strong className="text-sm leading-none tabular-nums">
          {formatCompactCount(score.count)}
        </strong>
      </div>
    </div>
  );
};
