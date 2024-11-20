import type {
  FlashcardDto,
  FlashcardsBoardDto,
  Pagination,
  ParsedError,
} from 'api-4markdown-contracts';
import type { Transaction } from 'development-kit/utility-types';

type FlashcardsCreatorStoreState = {
  creation: Transaction | { is: `started` };
  flashcardBoards:
    | Transaction<{ flashcardBoards: FlashcardsBoardDto[] }>
    | ((
        | { is: `loading-more`; flashcardBoards: FlashcardsBoardDto[] }
        | { is: `all-loaded`; flashcardBoards: FlashcardsBoardDto[] }
        | {
            is: `load-more-fail`;
            error: ParsedError;
            flashcardBoards: FlashcardsBoardDto[];
          }
      ) &
        Pagination);
  activeFlashcards: FlashcardDto[];
  activeFlashcardId: FlashcardDto['id'] | null;
};

type FlashcardsCreatorStoreActions = {
  activateFlashcard(id: FlashcardDto['id']): void;
  disactivateFlashcard(): void;
  startCreation(): void;
  resetCreation(): void;
};

type FlashcardsCreatorStoreActs = {
  loadBoards(): Promise<void>;
};

type FlashcardsCreatorStore = FlashcardsCreatorStoreState &
  FlashcardsCreatorStoreActions &
  FlashcardsCreatorStoreActs;

export type {
  FlashcardsCreatorStoreState,
  FlashcardsCreatorStoreActions,
  FlashcardsCreatorStoreActs,
  FlashcardsCreatorStore,
};
