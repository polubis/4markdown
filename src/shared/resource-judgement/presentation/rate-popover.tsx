import { Content, Portal, Root, Trigger } from "@radix-ui/react-popover";
import { Button } from "design-system/button";
import { c } from "design-system/c";
import React from "react";
import type { RatingCategory } from "../domain/models";
import { RATING_COLORS, RATING_ICONS } from "./config";
import { playRateSound, playRateSubmit, primeAudio } from "./sounds";

export type RatePopoverProps = {
  currentCategory: RatingCategory | null;
  onSubmit(category: RatingCategory): void;
  children: React.ReactElement;
};

const categoryLabel = (category: RatingCategory) =>
  category[0].toUpperCase() + category.slice(1);

export const RatePopover = ({
  currentCategory,
  onSubmit,
  children,
}: RatePopoverProps) => {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<RatingCategory | null>(null);

  const handleOpenChange = (next: boolean) => {
    if (next) {
      primeAudio();
      setSelected(currentCategory);
    }
    setOpen(next);
  };

  const submit = () => {
    if (!selected) return;
    playRateSubmit(selected);
    onSubmit(selected);
    setOpen(false);
  };

  const pickCategory = (category: RatingCategory): void => {
    playRateSound(category);
    setSelected(category);
  };

  return (
    <Root open={open} onOpenChange={handleOpenChange}>
      <Trigger asChild>{children}</Trigger>
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
              {currentCategory ? "Remix your verdict" : "How would you rate?"}
            </h3>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              {currentCategory
                ? "Same doc, new hot take — pick what fits now."
                : "Your rating helps the author."}
            </p>
          </div>

          <div className="mb-5 flex w-full items-start justify-between">
            {RATING_ICONS.map(({ category, Icon }) => {
              const isSelected = selected === category;
              return (
                <div key={category} className="flex flex-col items-center gap-2">
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
