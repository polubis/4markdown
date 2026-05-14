import { Content, Portal, Root, Trigger } from "@radix-ui/react-popover";
import { Root as SliderRoot, Track, Range, Thumb } from "@radix-ui/react-slider";
import { Button } from "design-system/button";
import { c } from "design-system/c";
import React, { type ComponentProps } from "react";
import { EMOJIS } from "./config";
import { playScoreSound, playScoreSubmit, primeAudio } from "./sounds";

const getAccentBg = (score: number): string => {
  if (score <= 2) return "bg-rose-500";
  if (score <= 4) return "bg-orange-500";
  if (score <= 6) return "bg-amber-400";
  if (score <= 8) return "bg-lime-500";
  return "bg-emerald-500";
};

const getAccentText = (score: number): string => {
  if (score <= 2) return "text-rose-500";
  if (score <= 4) return "text-orange-500";
  if (score <= 6) return "text-amber-500";
  if (score <= 8) return "text-lime-600";
  return "text-emerald-600";
};

const getBurstCount = (score: number): number =>
  Math.max(1, Math.min(10, Math.round(score)));

const getEmoji = (score: number): string =>
  (EMOJIS as readonly string[])[Math.max(0, Math.min(9, score - 1))];

const DEFAULT_SCORE = 5;

// Thumb radius in px (h-4 = 16px → radius = 8px) used to align ticks with thumb centers
const THUMB_RADIUS = 8;

type ScorePickerProps = ComponentProps<"div"> & {
  initialScore?: number;
  onSubmit?: (payload: { score: number }) => void;
};

const ScorePicker = ({ className, initialScore, onSubmit }: ScorePickerProps) => {
  const [submitted, setSubmitted] = React.useState<number | null>(
    initialScore ?? null,
  );
  const [open, setOpen] = React.useState(false);
  const [score, setScore] = React.useState(initialScore ?? DEFAULT_SCORE);
  const [burstKey, setBurstKey] = React.useState(0);

  const handleOpenChange = (next: boolean) => {
    if (next) {
      primeAudio();
      setScore(submitted ?? DEFAULT_SCORE);
    }
    setOpen(next);
  };

  const handleSliderChange = ([v]: number[]) => {
    setScore(v);
    playScoreSound(v);
  };

  const submit = () => {
    playScoreSubmit(score);
    onSubmit?.({ score });
    setSubmitted(score);
    setBurstKey((k) => k + 1);
    setOpen(false);
  };

  const burstCount = submitted !== null ? getBurstCount(submitted) : 0;

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
                submitted !== null
                  ? `Scored ${submitted}/10. Click to change.`
                  : "Click to score"
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
              {submitted !== null ? (
                <span
                  key={`jump-${burstKey}`}
                  aria-hidden="true"
                  className="text-3xl leading-none motion-safe:animate-rate-jump"
                >
                  {getEmoji(submitted)}
                </span>
              ) : (
                <span
                  key="idle"
                  aria-hidden="true"
                  className="text-3xl leading-none grayscale opacity-40 motion-safe:animate-rate-attract-jump"
                >
                  {getEmoji(DEFAULT_SCORE)}
                </span>
              )}
            </button>
          </Trigger>

          {submitted !== null && (
            <div
              key={burstKey}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
            >
              <div className="relative h-0 w-0">
                {Array.from({ length: burstCount }).map((_, i, arr) => {
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
                          getAccentBg(submitted),
                        )}
                        style={{
                          marginLeft: "2.75rem",
                          animationDelay: `${i * 40}ms`,
                        }}
                      />
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <span
          aria-hidden="true"
          className={c(
            "flex flex-col items-center leading-[0.7] text-zinc-400 dark:text-zinc-500 font-mono",
            submitted === null && "motion-safe:animate-rate-attract-arrow",
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
            submitted !== null
              ? "text-zinc-900 dark:text-zinc-50"
              : "text-zinc-400 dark:text-zinc-500",
          )}
        >
          {submitted !== null
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

          <div className="mb-5 flex flex-col items-center gap-1.5">
            <span
              key={score}
              aria-hidden="true"
              className="text-5xl leading-none motion-safe:animate-rate-jump"
            >
              {getEmoji(score)}
            </span>
            <span
              className={c(
                "font-mono font-bold tabular-nums text-sm",
                getAccentText(score),
              )}
            >
              {score}
              <span className="font-normal text-zinc-400 dark:text-zinc-500">
                /10
              </span>
            </span>
          </div>

          <div className="mb-5">
            <SliderRoot
              min={1}
              max={10}
              step={1}
              value={[score]}
              onValueChange={handleSliderChange}
              aria-label="Rating score"
              className="relative flex w-full touch-none select-none items-center"
            >
              <Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                <Range
                  className={c(
                    "absolute h-full rounded-full motion-safe:transition-colors motion-safe:duration-150",
                    getAccentBg(score),
                  )}
                />
              </Track>
              <Thumb
                className={c(
                  "block h-4 w-4 rounded-full border-2 border-white shadow-md",
                  "cursor-grab active:cursor-grabbing",
                  "motion-safe:transition-colors motion-safe:duration-150",
                  "focus-visible:outline dark:outline-2 outline-2.5 outline-black dark:outline-white",
                  getAccentBg(score),
                )}
              />
            </SliderRoot>

            {/* 10 tick marks aligned with thumb center positions */}
            <div aria-hidden="true" className="relative mt-1.5 h-4 select-none">
              {Array.from({ length: 10 }, (_, i) => (
                <span
                  key={i}
                  className="absolute top-0 flex flex-col items-center gap-0.5"
                  style={{
                    left: `calc(${THUMB_RADIUS}px + ${i / 9} * (100% - ${THUMB_RADIUS * 2}px))`,
                    transform: "translateX(-50%)",
                  }}
                >
                  <span
                    className={c(
                      "block w-px h-1.5 rounded-full motion-safe:transition-colors motion-safe:duration-150",
                      score === i + 1
                        ? getAccentBg(score)
                        : "bg-zinc-300 dark:bg-zinc-700",
                    )}
                  />
                  <span className="text-xs tabular-nums leading-none text-zinc-400 dark:text-zinc-500">
                    {i + 1}
                  </span>
                </span>
              ))}
            </div>
          </div>

          <Button
            type="button"
            auto
            s={2}
            i={2}
            onClick={submit}
            className="w-full"
          >
            Submit Review
          </Button>
        </Content>
      </Portal>
    </Root>
  );
};

export type { ScorePickerProps };
export { ScorePicker };
