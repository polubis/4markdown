import React from "react";
import { useSimpleFeature } from "@greenonsoftware/react-kit";
import { Atoms } from "api-4markdown-contracts";
import { Markdown } from "components/markdown";
import { Button } from "design-system/button";
import { c } from "design-system/c";
import { Modal2 } from "design-system/modal2";
import { BiInfoCircle } from "react-icons/bi";

type BullshitMeterProps = {
  rating: Atoms["Rating"];
  score: Atoms["Score"];
  commentsCount: number;
  className?: string;
};

const BULLSHIT_EXPLANATION_MARKDOWN = `
## How Bullshit score is calculated

This meter combines **score** and **rating sentiment** into one number in range **0..10**.

### 1) Score part

The incoming score (already converted to "bullshit direction" by the consumer) is clamped:

$$
S = \\text{clamp}(\\text{scoreAverage}, 0, 10)
$$

### 2) Rating part

Rating buckets are weighted by sentiment:

- **Negative**: \`ugly = 10\`, \`bad = 8\`
- **Neutral**: \`decent = 5\`
- **Positive**: \`good = 2\`, \`perfect = 0\`

Weighted rating score:

$$
R = \\frac{10 \\cdot ugly + 8 \\cdot bad + 5 \\cdot decent + 2 \\cdot good + 0 \\cdot perfect}{ugly + bad + decent + good + perfect}
$$

If there are no ratings, then:

$$
R = 0
$$

### 3) Dynamic blend

More ratings increase rating impact:

$$
w = \\min(0.45, 0.2 + \\frac{ratingsCount}{60})
$$

Final meter score:

$$
B = \\text{clamp}(S \\cdot (1 - w) + R \\cdot w, 0, 10)
$$

Where **B** is the displayed **Bullshit score**.

## Quality labels

Labels are picked by the final normalized index:

- **Looks solid**: very low bullshit
- **Mostly fine**: low bullshit
- **Mixed quality**: moderate uncertainty
- **Questionable**: medium-high bullshit
- **Very sketchy**: high bullshit
- **BULLSHIT!!**: extreme bullshit
`;

type BullshitCalculationModalProps = {
  onClose(): void;
};

const BullshitCalculationModal = ({
  onClose,
}: BullshitCalculationModalProps) => {
  return (
    <Modal2
      className="[&>*]:w-[100%] [&>*]:max-w-2xl"
      onClose={onClose}
      data-testid="[bullshit-calculation-modal]:container"
    >
      <Modal2.Header
        title="Bullshit Score: calculation"
        closeButtonTitle="Close bullshit score explanation"
      />
      <Modal2.Body>
        <Markdown>{BULLSHIT_EXPLANATION_MARKDOWN}</Markdown>
      </Modal2.Body>
    </Modal2>
  );
};

const clampScore = (score: number): number => {
  return Math.max(0, Math.min(10, score));
};

const getBullshitStatus = ({
  scoreAverage,
  commentsCount,
  scoreCount,
}: {
  scoreAverage: number;
  commentsCount: number;
  scoreCount: number;
}): { emoji: string; text: string; index: number } => {
  const scoreBadness = clampScore(scoreAverage) / 10;
  const commentsImpact = Math.min(1, commentsCount / 20);
  const participationImpact = Math.min(1, scoreCount / 20);
  const confidence = Math.max(commentsImpact, participationImpact) * 0.15;
  const index = Math.max(0, Math.min(1, scoreBadness * (0.85 + confidence)));

  if (index >= 0.85) {
    return { emoji: "🤡", text: "BULLSHIT!!", index };
  }
  if (index >= 0.7) {
    return { emoji: "😵", text: "Very sketchy", index };
  }
  if (index >= 0.55) {
    return { emoji: "😬", text: "Questionable", index };
  }
  if (index >= 0.4) {
    return { emoji: "😐", text: "Mixed quality", index };
  }
  if (index >= 0.25) {
    return { emoji: "🙂", text: "Mostly fine", index };
  }
  return { emoji: "😎", text: "Looks solid", index };
};

const getFillPaletteClass = (score: number): string => {
  if (score === 0) {
    return "from-emerald-600 via-green-500 to-emerald-600 dark:from-emerald-900 dark:via-green-800 dark:to-emerald-900";
  }

  const normalizedScore = clampScore(score);

  if (normalizedScore <= 2) {
    return "from-green-600 via-green-500 to-emerald-600 dark:from-green-800 dark:via-green-700 dark:to-emerald-800";
  }
  if (normalizedScore <= 4) {
    return "from-yellow-500 via-lime-500 to-green-600 dark:from-yellow-700 dark:via-lime-700 dark:to-green-800";
  }
  if (normalizedScore <= 6) {
    return "from-orange-500 via-amber-500 to-yellow-500 dark:from-orange-800 dark:via-amber-800 dark:to-yellow-700";
  }
  if (normalizedScore <= 8) {
    return "from-red-500 via-orange-600 to-orange-500 dark:from-red-800 dark:via-orange-900 dark:to-orange-800";
  }

  return "from-red-600 via-red-500 to-orange-600 dark:from-red-900 dark:via-red-800 dark:to-orange-900";
};

type BubbleSpec = {
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
};

const getRatingBullshitScore = (rating: Atoms["Rating"]): number => {
  const total =
    rating.ugly + rating.bad + rating.decent + rating.good + rating.perfect;

  if (total === 0) {
    return 0;
  }

  // 2 negative keys (ugly/bad), 1 neutral (decent), 2 positive (good/perfect).
  // Higher result means more bullshit in 0..10 scale.
  const weightedSum =
    rating.ugly * 10 +
    rating.bad * 8 +
    rating.decent * 5 +
    rating.good * 2 +
    rating.perfect * 0;

  return clampScore((weightedSum / total / 10) * 10);
};

const createBubbleSpecs = (bullshitLevel: number): BubbleSpec[] => {
  const count = Math.max(2, Math.round(2 + bullshitLevel * 2.2));

  return Array.from({ length: count }, (_, index) => {
    const seed = (index + 1) * 73;
    const duration =
      1.4 + (((seed * 13) % 17) / 10 + (10 - bullshitLevel) * 0.04);

    return {
      left: (seed * 37) % 100,
      top: 18 + ((seed * 23) % 62),
      size: 3 + ((seed * 19) % 7),
      duration,
      // Negative delay phases each bubble so they don't stack at animation start.
      delay: -(((seed * 29) % 14) * 0.12 + duration * ((seed % 7) / 10)),
      opacity: 0.3 + ((seed * 41) % 5) * 0.12,
    };
  });
};

const BullshitMeter = ({
  rating,
  score,
  commentsCount,
  className,
}: BullshitMeterProps) => {
  const explanationModal = useSimpleFeature();
  const rawBullshitScore = clampScore(score.scoreAverage);
  const ratingBullshitScore = getRatingBullshitScore(rating);
  const totalRatings =
    rating.ugly + rating.bad + rating.decent + rating.good + rating.perfect;
  const ratingWeight =
    totalRatings === 0 ? 0 : Math.min(0.45, 0.2 + totalRatings / 60);
  const normalizedScore = clampScore(
    rawBullshitScore * (1 - ratingWeight) + ratingBullshitScore * ratingWeight,
  );
  const bullshitLevel = normalizedScore;
  const isMaxBullshitLevel = bullshitLevel >= 10;
  const scoreCount = Math.max(score.scoreCount, score.scoreValues.length);
  const meterFillPercent = normalizedScore * 10;
  const fillPaletteClass = getFillPaletteClass(normalizedScore);
  const bubbleSpecs = React.useMemo(
    () => createBubbleSpecs(bullshitLevel),
    [bullshitLevel],
  );
  const status = getBullshitStatus({
    scoreAverage: normalizedScore,
    commentsCount,
    scoreCount,
  });

  return (
    <div
      className={c(
        "w-full rounded-xl border border-zinc-300 bg-white/80 p-4 shadow-[0_2px_8px_-6px_rgba(0,0,0,0.18)] backdrop-blur-sm transition-transform",
        "dark:border-zinc-800 dark:bg-zinc-950/70 dark:shadow-sm",
        isMaxBullshitLevel && "bullshit-sonic-shake",
        className,
      )}
    >
      <style>
        {`
          @keyframes bullshit-bubble-rise {
            0% {
              transform: translate3d(-10px, 0, 0) scale(0.55);
              opacity: 0;
            }
            15% {
              opacity: 1;
            }
            100% {
              transform: translate3d(220px, 0, 0) scale(1.05);
              opacity: 0;
            }
          }

          @keyframes bullshit-sonic-shake {
            0% {
              transform: translate(0, 0) rotate(0deg);
            }
            20% {
              transform: translate(1px, -1px) rotate(-0.7deg);
            }
            40% {
              transform: translate(-1px, 1px) rotate(0.7deg);
            }
            60% {
              transform: translate(1px, 1px) rotate(-0.45deg);
            }
            80% {
              transform: translate(-1px, -1px) rotate(0.45deg);
            }
            100% {
              transform: translate(0, 0) rotate(0deg);
            }
          }

          .bullshit-sonic-shake {
            animation: bullshit-sonic-shake 0.11s linear infinite;
          }
        `}
      </style>
      <header className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-base font-semibold text-black dark:text-white text-pretty">
          Bullshit Meter
        </h3>
        <div className="flex items-center gap-2">
          <Button
            s={1}
            i={1}
            title="Open bullshit score explanation"
            onClick={explanationModal.on}
          >
            <BiInfoCircle />
          </Button>
          <span
            role="img"
            aria-label={status.text}
            className="relative inline-flex h-8 w-8 items-center justify-center rounded-full bg-zinc-50 text-lg leading-none shadow-[0_1px_4px_-2px_rgba(0,0,0,0.2)] dark:bg-zinc-900 dark:shadow-sm"
          >
            {status.emoji}
            {isMaxBullshitLevel && (
              <>
                <span className="pointer-events-none absolute h-10 w-10 rounded-full border border-red-400/60 animate-ping" />
                <span className="pointer-events-none absolute h-14 w-14 rounded-full border border-orange-400/40 animate-ping [animation-delay:150ms]" />
              </>
            )}
          </span>
        </div>
      </header>

      <div className="space-y-3">
        <meter
          min={0}
          max={10}
          value={normalizedScore}
          aria-label="Bullshit score"
          className="sr-only"
        >
          {normalizedScore.toFixed(1)} out of 10
        </meter>
        <div className="relative h-12 w-full overflow-hidden rounded-full bg-zinc-100 shadow-[inset_0_1px_8px_rgba(0,0,0,0.08),0_6px_14px_-10px_rgba(0,0,0,0.2)] dark:bg-zinc-900 dark:shadow-[inset_0_2px_14px_rgba(0,0,0,0.15),0_10px_24px_-12px_rgba(0,0,0,0.6)]">
          <div
            className={c(
              "absolute inset-y-0 left-0 rounded-full bg-gradient-to-r animate-gradient-move bg-[length:200%_200%] transition-[width] duration-300",
              fillPaletteClass,
            )}
            style={{ width: `${meterFillPercent}%` }}
          />
          <div
            className="pointer-events-none absolute inset-y-0 left-0 overflow-hidden rounded-full"
            style={{ width: `${meterFillPercent}%` }}
          >
            {bubbleSpecs.map((bubble, index) => (
              <span
                key={`bubble-${index}-${bubble.left}-${bubble.size}`}
                className={c(
                  "absolute -translate-x-1/2 rounded-full",
                  "bg-white/75 dark:bg-zinc-100/70",
                  isMaxBullshitLevel &&
                    "shadow-[0_0_10px_rgba(251,146,60,0.4)] dark:shadow-[0_0_16px_rgba(251,146,60,0.8)]",
                )}
                style={{
                  left: `${bubble.left}%`,
                  top: `${bubble.top}%`,
                  width: `${bubble.size}px`,
                  height: `${bubble.size}px`,
                  animation: `bullshit-bubble-rise ${bubble.duration}s linear ${bubble.delay}s infinite`,
                  opacity: bubble.opacity,
                }}
              />
            ))}
          </div>
          <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/30 via-white/10 to-transparent dark:from-white/20 dark:via-transparent" />
        </div>
        <div className="flex items-end justify-between gap-3">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-600 dark:text-zinc-300">
            {status.text}
          </p>
          <div className="min-w-0 text-right">
            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              Bullshit score
            </p>
            <p className="text-2xl font-bold tabular-nums text-black dark:text-white">
              {normalizedScore.toFixed(1)}/10
            </p>
          </div>
        </div>
      </div>
      {explanationModal.isOn && (
        <BullshitCalculationModal onClose={explanationModal.off} />
      )}
    </div>
  );
};

export type { BullshitMeterProps };
export { BullshitMeter };
