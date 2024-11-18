import type { FlashcardDto } from 'api-4markdown-contracts';

type FlashcardsCreatorStoreState = {
  flashcards: FlashcardDto[];
  activeFlashcardId: FlashcardDto['id'] | null;
};

export type { FlashcardsCreatorStoreState };
