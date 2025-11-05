import { Atoms } from "api-4markdown-contracts";
import { RATING_ICONS } from "core/rating-config";
import { Button } from "design-system/button";
import { c } from "design-system/c";
import { toast } from "design-system/toast";
import { playNote } from "development-kit/play-note";
import React from "react";

type RatePickerProps = {
  className?: string;
  rating: Record<Atoms["RatingCategory"], number>;
  rate: Atoms["RatingCategory"] | null;
  onRate: (category: Atoms["RatingCategory"], index: number) => void;
};

const RATE_NOTES = ["c4", "d4", "e4", "f4", "g4"] as const;

const RatePicker = ({ className, rate, rating, onRate }: RatePickerProps) => {
  const rateAndPlay = async (
    category: Atoms["RatingCategory"],
    index: number,
  ): Promise<void> => {
    playNote(RATE_NOTES[index]);
    toast.success({
      duration: 2000,
      title: "Rate added. Thx!",
      position: "bottom-left",
    });
    onRate(category, index);
  };

  return (
    <div className={c(`flex`, className)}>
      {RATING_ICONS.map(([Icon, category], idx) => (
        <Button
          i={rate === category ? 2 : 1}
          s={1}
          auto
          key={category}
          title={`Rate as ${category}`}
          onClick={() => rateAndPlay(category, idx)}
        >
          <Icon className="mr-0.5" />
          <strong>{rating[category]}</strong>
        </Button>
      ))}
    </div>
  );
};

export { RatePicker };
