import { Atoms } from "api-4markdown-contracts";
import { RATING_ICONS } from "core/rating-config";
import { Button } from "design-system/button";
import { c } from "design-system/c";
import { playNote } from "development-kit/play-note";
import React from "react";

type RatePickerProps = {
  className?: string;
  rating?: Partial<Record<Atoms["RatingCategory"], number>>;
  disabled?: boolean;
  rate: Atoms["RatingCategory"] | null;
  onRate: (category: Atoms["RatingCategory"], index: number) => void;
};

const RATE_NOTES = ["c4", "d4", "e4", "f4", "g4"] as const;

const RatePicker = ({
  className,
  rate,
  disabled,
  rating = {},
  onRate,
}: RatePickerProps) => {
  const rateAndPlay = async (
    category: Atoms["RatingCategory"],
    index: number,
  ): Promise<void> => {
    playNote(RATE_NOTES[index]);
    onRate(category, index);
  };

  return (
    <div className={c(`flex`, className)}>
      {RATING_ICONS.map(([Icon, category], idx) => (
        <Button
          i={rate === category ? 2 : 1}
          s={1}
          auto
          disabled={disabled}
          key={category}
          title={`Rate as ${category}`}
          onClick={() => rateAndPlay(category, idx)}
        >
          <Icon className="mr-0.5" />
          <strong>{rating[category] ?? 0}</strong>
        </Button>
      ))}
    </div>
  );
};

export { RatePicker };
