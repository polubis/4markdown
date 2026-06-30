import { c } from "design-system/c";
import React, { ComponentProps } from "react";
import type { RatingCategory } from "../domain/models";
import {
  buttonFocusOutlineClass,
  RATING_BG_COLORS,
  RATING_BURST_COUNT,
  RATING_COLORS,
  RATING_ICONS,
} from "./config";
import { useContext } from "./context";
import { RatePopover } from "./rate-popover";

export type RatePickerProps = ComponentProps<"div"> & {
  mirrored?: boolean;
};

const categoryLabel = (category: RatingCategory) =>
  category[0].toUpperCase() + category.slice(1);

const ICON_BY_CATEGORY = Object.fromEntries(
  RATING_ICONS.map(({ category, Icon }) => [category, Icon]),
) as Record<RatingCategory, (typeof RATING_ICONS)[number]["Icon"]>;

export const RatePicker = ({
  className,
  mirrored = false,
  ...rest
}: RatePickerProps) => {
  const { rateResource, useMyCategory } = useContext();
  const myCategory = useMyCategory();
  const prevMyCategory = React.useRef(myCategory);
  const [burstKey, setBurstKey] = React.useState(0);

  React.useEffect(() => {
    if (prevMyCategory.current !== myCategory && myCategory !== null) {
      setBurstKey((k) => k + 1);
    }
    prevMyCategory.current = myCategory;
  }, [myCategory]);

  const TriggerIcon = myCategory
    ? ICON_BY_CATEGORY[myCategory]
    : ICON_BY_CATEGORY.perfect;
  const triggerColor = myCategory
    ? RATING_COLORS[myCategory]
    : "text-zinc-400 dark:text-zinc-500";

  return (
    <div
      {...rest}
      className={c(
        "flex w-40 flex-col items-center gap-2 text-center",
        className,
      )}
    >
      <div className="relative">
        <RatePopover currentCategory={myCategory} onSubmit={rateResource}>
          <button
            type="button"
            aria-label={
              myCategory
                ? `You went with ${categoryLabel(myCategory)}. Open to remix your vote.`
                : "Click to rate"
            }
            className={c(
              "flex h-20 w-20 items-center justify-center rounded-full border bg-white shadow-md",
              "motion-safe:transition-[border-color,box-shadow,transform] motion-safe:duration-150",
              "border-zinc-300 hover:border-zinc-400 hover:shadow-lg active:scale-95 active:shadow-sm",
              "data-[state=open]:border-zinc-400 data-[state=open]:shadow-lg",
              "dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:shadow-sm",
              buttonFocusOutlineClass,
            )}
          >
            <TriggerIcon
              key={myCategory ? `jump-${burstKey}` : "idle"}
              aria-hidden="true"
              size={32}
              className={c(
                "transition-colors",
                triggerColor,
                myCategory
                  ? "fill-current motion-safe:animate-rate-jump"
                  : "motion-safe:animate-rate-attract-jump",
              )}
            />
          </button>
        </RatePopover>
        {myCategory && (
          <div
            key={burstKey}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <div className="relative h-0 w-0">
              {Array.from({ length: RATING_BURST_COUNT[myCategory] }).map(
                (_, i, arr) => {
                  const span = 140;
                  const angle =
                    arr.length === 1
                      ? -90
                      : -90 - span / 2 + (i * span) / (arr.length - 1);
                  return (
                    <span
                      key={i}
                      className="absolute left-0 top-0"
                      style={{
                        transform: `rotate(${angle}deg)`,
                        transformOrigin: "0 0",
                      }}
                    >
                      <span
                        className={c(
                          "block h-0.5 w-3 origin-left rounded-full",
                          "motion-safe:animate-rate-burst",
                          RATING_BG_COLORS[myCategory],
                        )}
                        style={{
                          marginLeft: "2.75rem",
                          animationDelay: `${i * 40}ms`,
                        }}
                      />
                    </span>
                  );
                },
              )}
            </div>
          </div>
        )}
      </div>
      <span
        aria-hidden="true"
        className={c(
          "flex flex-col items-center leading-[0.7] text-zinc-400 dark:text-zinc-500 font-mono",
          !myCategory && "motion-safe:animate-rate-attract-arrow",
        )}
      >
        <span className="text-base">^</span>
        <span className={c("text-xs", mirrored ? "pl-1" : "pr-1")}>·</span>
        <span className={c("text-xs", mirrored ? "pl-3" : "pr-3")}>·</span>
        <span className={c("text-xs", mirrored ? "pl-5" : "pr-5")}>·</span>
      </span>
      <span
        className={c(
          "min-h-10 flex items-center justify-center text-sm font-normal leading-tight",
          mirrored ? "pl-4" : "pr-4",
          myCategory
            ? "text-zinc-900 dark:text-zinc-50"
            : "text-zinc-400 dark:text-zinc-500",
        )}
      >
        {myCategory
          ? "Plot twist? Remix your rating"
          : "Click to rate".split("").map((char, i) => (
              <span
                key={i}
                className="inline-block whitespace-pre motion-safe:animate-rate-letter-walk"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                {char}
              </span>
            ))}
      </span>
    </div>
  );
};
