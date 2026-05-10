import { c } from "design-system/c";
import React, { type ComponentProps } from "react";
import type { Rating, RatingCategory } from "../domain/models";
import { RATING_COLORS, RATING_ICONS } from "./config";

export type RateSummaryProps = ComponentProps<"div"> & {
  activeCategory?: RatingCategory;
  rating: Rating;
};

export const RateSummary = ({
  activeCategory,
  className,
  rating,
  ...props
}: RateSummaryProps) => {
  return (
    <div
      {...props}
      className={c(
        "flex w-fit items-center gap-3 rounded-md border px-2 py-2 shadow-sm",
        "border-zinc-300 bg-zinc-100 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-300",
        className,
      )}
    >
      {RATING_ICONS.map(({ category, Icon }) => (
        <div
          key={category}
          className={c(
            "flex items-center gap-1.5 rounded-md leading-none",
            activeCategory === category &&
              "bg-white/90 px-1.5 py-1 dark:bg-zinc-800/60",
          )}
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
