import type { FlashcardDto } from 'api-4markdown-contracts';
import type { Transaction } from 'development-kit/utility-types';

type FlashcardsCreatorStoreState = {
  flashcards: FlashcardDto[];
  activeFlashcardId: FlashcardDto['id'] | null;
  creation: Transaction;
};

export type { FlashcardsCreatorStoreState };
