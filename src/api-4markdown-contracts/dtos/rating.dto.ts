const RATING_CATEGORIES = [`ugly`, `bad`, `decent`, `good`, `perfect`] as const;

type RatingCategory = (typeof RATING_CATEGORIES)[number];

type RatingDto = Record<RatingCategory, number>;

export { RATING_CATEGORIES };
export type { RatingDto, RatingCategory };
