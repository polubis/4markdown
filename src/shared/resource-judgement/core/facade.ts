import { rateResource } from "./handlers/rate-resource";
import { addScore } from "./handlers/add-score";
import { loadComments } from "./handlers/load-comments";
import { Store } from "./store";
import { Bus } from "./bus";
import { BusEvent } from "../domain/models";

const clampScore = (score: number): number => {
  return Math.max(0, Math.min(10, score));
};

const toRawBullshitScore = (scoreAverage: number): number => {
  if (scoreAverage <= 0) {
    return 0;
  }

  return clampScore(11 - scoreAverage);
};

const getRatingBullshitScore = (rating: {
  ugly: number;
  bad: number;
  decent: number;
  good: number;
  perfect: number;
}): number => {
  const total =
    rating.ugly + rating.bad + rating.decent + rating.good + rating.perfect;

  if (total === 0) {
    return 0;
  }

  const weightedSum =
    rating.ugly * 10 +
    rating.bad * 8 +
    rating.decent * 5 +
    rating.good * 2 +
    rating.perfect * 0;

  return clampScore(weightedSum / total);
};

const toMeterValue = (state: ReturnType<Store["getState"]>): number => {
  const rawBullshitScore = toRawBullshitScore(state.score.average);
  const ratingBullshitScore = getRatingBullshitScore(state.rating);
  const totalRatings =
    state.rating.ugly +
    state.rating.bad +
    state.rating.decent +
    state.rating.good +
    state.rating.perfect;
  const ratingWeight =
    totalRatings === 0 ? 0 : Math.min(0.45, 0.2 + totalRatings / 60);

  return clampScore(
    rawBullshitScore * (1 - ratingWeight) + ratingBullshitScore * ratingWeight,
  );
};

export const createFacade = (useStore: Store, bus: Bus) => {
  return {
    rateResource: rateResource(useStore, bus),
    addScore: addScore(useStore, bus),
    loadComments: loadComments(useStore),
    useRating: () => useStore((state) => state.rating),
    useScore: () => useStore((state) => state.score),
    useMeterValue: () => useStore(toMeterValue),
    useMyCategory: () => useStore((state) => state.myCategory),
    useMyScore: () => useStore((state) => state.myScore),
    useComments: () => useStore((state) => state.comments),
    onBusEvent: (onEvent: (event: BusEvent) => void) => bus.subscribe(onEvent),
  };
};

export type Facade = ReturnType<typeof createFacade>;
