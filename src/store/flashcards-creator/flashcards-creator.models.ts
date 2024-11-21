import type {
  API4MarkdownPayload,
  FlashcardDto,
  FlashcardsBoardDto,
} from 'api-4markdown-contracts';
import type { Transaction } from 'development-kit/utility-types';

type FlashcardsCreatorStoreState = {
  activeFlashcardsBoardId: FlashcardsBoardDto['id'] | null;
  flashcardBoardsVisible: boolean;
  flashcardsBoardCreation: Transaction | { is: `started` };
  flashcardBoards: Transaction<{ data: FlashcardsBoardDto[] }>;
  activeFlashcards: FlashcardDto[];
  activeFlashcardId: FlashcardDto['id'] | null;
};

type FlashcardsCreatorStoreActions = {
  activateFlashcard(id: FlashcardDto['id']): void;
  disactivateFlashcard(): void;
  startCreation(): void;
  resetCreation(): void;
  showFlashcardBoards(): void;
  updateFlashcard(content: FlashcardDto['content']): void;
  hideFlashcardBoards(): void;
  activateFlashcardsBoard(id: FlashcardsBoardDto['id']): void;
  removeFlashcard(): void;
};

type FlashcardsCreatorStoreActs = {
  loadBoards(): Promise<void>;
  reloadBoards(): Promise<void>;
  createBoard(values: {
    name: API4MarkdownPayload<'createFlashcardsBoard'>['name'];
    description: NonNullable<
      API4MarkdownPayload<'createFlashcardsBoard'>['description']
    >;
  }): Promise<void>;
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
