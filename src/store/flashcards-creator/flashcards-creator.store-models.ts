import type { FlashcardsBoardDto } from 'api-4markdown-contracts';

type FlashcardsCreatorStoreState = {
  flashcards: FlashcardsBoardDto['flashcards'];
};

export type { FlashcardsCreatorStoreState };
