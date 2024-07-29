const DOCUMENT_RATING_CATEGORIES = [
  `ugly`,
  `bad`,
  `decent`,
  `good`,
  `perfect`,
] as const;

type DocumentRatingDto = Record<
  (typeof DOCUMENT_RATING_CATEGORIES)[number],
  number
>;

export { DOCUMENT_RATING_CATEGORIES };
export type { DocumentRatingDto };
