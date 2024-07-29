const DOCUMENT_RATING_CATEGORIES = [
  `ugly`,
  `bad`,
  `decent`,
  `good`,
  `perfect`,
] as const;

type DocumentRatingCategory = (typeof DOCUMENT_RATING_CATEGORIES)[number];

type DocumentRatingDto = Record<DocumentRatingCategory, number>;

export { DOCUMENT_RATING_CATEGORIES };
export type { DocumentRatingDto, DocumentRatingCategory };
