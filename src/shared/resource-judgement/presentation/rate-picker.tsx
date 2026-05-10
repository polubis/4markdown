import { Content, Portal, Root, Trigger } from "@radix-ui/react-popover";
import { Button } from "design-system/button";
import { c } from "design-system/c";
import React, { ComponentProps } from "react";
import { playRateSound, playRateSubmit, primeAudio } from "./sounds";
import type { Rating, RatingCategory } from "../domain/models";
import {
  RATING_BG_COLORS,
  RATING_BURST_COUNT,
  RATING_COLORS,
  RATING_ICONS,
} from "./config";

type RatePickerProps = ComponentProps<"div"> & {
  rating?: Rating;
  initialRating?: RatingCategory;
  onSubmit?: (payload: { category: RatingCategory }) => void;
};

const categoryLabel = (category: RatingCategory) =>
  category[0].toUpperCase() + category.slice(1);

const ICON_BY_CATEGORY = Object.fromEntries(
  RATING_ICONS.map(({ category, Icon }) => [category, Icon]),
) as Record<RatingCategory, (typeof RATING_ICONS)[number]["Icon"]>;

export const RatePicker = ({
  className,
  initialRating,
  onSubmit,
}: RatePickerProps) => {
  const [rated, setRated] = React.useState<RatingCategory | null>(
    initialRating ?? null,
  );
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<RatingCategory | null>(null);
  const [burstKey, setBurstKey] = React.useState(0);

  const handleOpenChange = (next: boolean) => {
    if (next) {
      primeAudio();
      setSelected(rated);
    }
    setOpen(next);
  };

  const submit = () => {
    if (!selected) return;
    playRateSubmit(selected);
    onSubmit?.({ category: selected });
    setRated(selected);
    setBurstKey((k) => k + 1);
    setOpen(false);
  };

  const pickCategory = (category: RatingCategory): void => {
    playRateSound(category);
    setSelected(category);
  };

  const TriggerIcon = rated
    ? ICON_BY_CATEGORY[rated]
    : ICON_BY_CATEGORY.perfect;
  const triggerColor = rated
    ? RATING_COLORS[rated]
    : "text-zinc-400 dark:text-zinc-500";

  return (
    <Root open={open} onOpenChange={handleOpenChange}>
      <div
        className={c("flex flex-col items-center gap-2 text-center", className)}
      >
        <div className="relative">
          <Trigger asChild>
            <button
              type="button"
              aria-label={
                rated
                  ? `Rated ${categoryLabel(rated)}. Click to rate again.`
                  : "Click to rate"
              }
              className={c(
                "flex h-20 w-20 items-center justify-center rounded-full border bg-white shadow-md",
                "motion-safe:transition-[border-color,box-shadow,transform] motion-safe:duration-150",
                "border-zinc-300 hover:border-zinc-400 hover:shadow-lg active:scale-95 active:shadow-sm",
                "data-[state=open]:border-zinc-400 data-[state=open]:shadow-lg",
                "dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:shadow-sm",
                "focus-visible:outline dark:outline-2 outline-2.5 outline-black dark:outline-white",
              )}
            >
              <TriggerIcon
                key={rated ? `jump-${burstKey}` : "idle"}
                aria-hidden="true"
                size={32}
                className={c(
                  "transition-colors",
                  triggerColor,
                  rated
                    ? "fill-current motion-safe:animate-rate-jump"
                    : "motion-safe:animate-rate-attract-jump",
                )}
              />
            </button>
          </Trigger>
          {rated && (
            <div
              key={burstKey}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
            >
              <div className="relative h-0 w-0">
                {Array.from({ length: RATING_BURST_COUNT[rated] }).map(
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
                            RATING_BG_COLORS[rated],
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
            !rated && "motion-safe:animate-rate-attract-arrow",
          )}
        >
          <span className="text-base">^</span>
          <span className="text-xs pr-1">·</span>
          <span className="text-xs pr-2">·</span>
          <span className="text-xs pr-3">·</span>
        </span>
        <span
          className={c(
            "text-sm font-normal leading-tight pr-4",
            rated
              ? "text-zinc-900 dark:text-zinc-50"
              : "text-zinc-400 dark:text-zinc-500",
          )}
        >
          {rated
            ? "Click to change rate"
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

      <Portal>
        <Content
          align="center"
          sideOffset={6}
          className={c(
            "z-50 w-[280px] rounded-2xl border bg-white p-4 shadow-xl outline-none flex flex-col",
            "border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          )}
        >
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              How would you rate?
            </h3>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              Your rating helps the author.
            </p>
          </div>

          <div className="mb-5 flex w-full items-start justify-between">
            {RATING_ICONS.map(({ category, Icon }) => {
              const isSelected = selected === category;
              return (
                <div
                  key={category}
                  className="flex flex-col items-center gap-2"
                >
                  <button
                    type="button"
                    aria-label={`Rate as ${categoryLabel(category)}`}
                    aria-pressed={isSelected}
                    onClick={() => pickCategory(category)}
                    className={c(
                      "flex h-11 w-11 items-center justify-center rounded-full border bg-white shadow-sm",
                      "motion-safe:transition-[border-color,box-shadow,transform] motion-safe:duration-150",
                      "active:scale-95 active:shadow-sm",
                      "focus-visible:outline dark:outline-2 outline-2.5 outline-black dark:outline-white",
                      isSelected
                        ? "border-zinc-300 shadow-md dark:border-zinc-700"
                        : "border-zinc-200 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:hover:border-zinc-700",
                      "dark:bg-zinc-900",
                    )}
                  >
                    <Icon
                      aria-hidden="true"
                      className={c(
                        "h-[22px] w-[22px]",
                        "transition-colors",
                        isSelected
                          ? c(RATING_COLORS[category], "fill-current")
                          : "text-zinc-600 dark:text-zinc-500",
                      )}
                    />
                  </button>
                  <span
                    className={c(
                      "text-xs font-medium leading-none",
                      isSelected
                        ? "text-zinc-900 dark:text-zinc-50"
                        : "text-zinc-700 dark:text-zinc-400",
                    )}
                  >
                    {categoryLabel(category)}
                  </span>
                </div>
              );
            })}
          </div>

          <Button
            type="button"
            auto
            s={2}
            i={2}
            onClick={submit}
            disabled={!selected}
            className="w-full"
          >
            Submit Review
          </Button>
        </Content>
      </Portal>
    </Root>
  );
};
