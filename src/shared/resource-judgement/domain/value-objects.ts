import type { CommentId, MeterInput, MeterValue, Rating } from "./models";

const OPTIMISTIC_COMMENT_ID_PREFIX = "__optimistic__";

export const createOptimisticCommentId = (): CommentId =>
  `${OPTIMISTIC_COMMENT_ID_PREFIX}${crypto.randomUUID()}`;

export const isOptimisticCommentId = (id: CommentId) =>
  String(id).startsWith(OPTIMISTIC_COMMENT_ID_PREFIX);

const clampMeterValue = (value: number): MeterValue => {
  return Math.max(0, Math.min(10, value));
};

const toRawBullshitScore = (scoreAverage: number): number => {
  if (scoreAverage <= 0) {
    return 0;
  }

  return clampMeterValue(11 - scoreAverage);
};

const toRatingBullshitScore = (rating: Rating): number => {
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

  return clampMeterValue(weightedSum / total);
};

export const toMeterValue = ({ rating, score }: MeterInput): MeterValue => {
  const rawBullshitScore = toRawBullshitScore(score.average);
  const ratingBullshitScore = toRatingBullshitScore(rating);
  const totalRatings =
    rating.ugly + rating.bad + rating.decent + rating.good + rating.perfect;
  const ratingWeight =
    totalRatings === 0 ? 0 : Math.min(0.45, 0.2 + totalRatings / 60);

  return clampMeterValue(
    rawBullshitScore * (1 - ratingWeight) + ratingBullshitScore * ratingWeight,
  );
};
