import { c } from "design-system/c";
import React, { type ComponentProps } from "react";
import { RATING_COLORS, RATING_ICONS } from "./config";
import { useContext } from "./context";

export type RateSummaryProps = ComponentProps<"div">;

export const RateSummary = ({ className, ...rest }: RateSummaryProps) => {
  const { useRating, useMyCategory } = useContext();
  const rating = useRating();
  const activeCategory = useMyCategory();

  return (
    <div
      {...rest}
      className={c(
        "flex w-fit items-center gap-3 rounded-md border px-2 py-2 shadow-sm",
        "border-zinc-300 bg-zinc-100 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-300",
        className,
      )}
    >
      {RATING_ICONS.map(({ category, Icon }) => (
        <div
          key={category}
          className="flex items-center gap-1.5 rounded-md leading-none"
        >
          <Icon
            aria-hidden="true"
            className={c(
              activeCategory === category && RATING_COLORS[category],
            )}
            size={20}
          />
          <strong className="text-sm leading-none">{rating[category]}</strong>
        </div>
      ))}
    </div>
  );
};
