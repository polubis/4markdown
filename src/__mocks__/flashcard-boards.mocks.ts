import type { FlashcardsBoardDto } from 'api-4markdown-contracts';

const FLASHCARD_BOARDS: FlashcardsBoardDto[] = [
  {
    id: `1`,
    name: `My private flashcards board`,
    visibility: `private`,
    flashcards: [],
  },
  {
    id: `2`,
    name: `My public flashcards board`,
    visibility: `public`,
    flashcards: [],
  },
  {
    id: `3`,
    name: `My permanent flashcards board`,
    visibility: `permanent`,
    flashcards: [],
  },
];

export { FLASHCARD_BOARDS };
