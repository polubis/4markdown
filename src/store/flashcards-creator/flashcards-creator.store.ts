import { FLASHCARD_BOARDS } from '__mocks__/flashcard-boards.mocks';
import { parseError } from 'api-4markdown';
import type {
  API4MarkdownDto,
  API4MarkdownPayload,
  Pagination,
} from 'api-4markdown-contracts';
import { mock } from 'development-kit/mock';
import { create } from 'zustand';
import type { FlashcardsCreatorStore } from './flashcards-creator.models';

const useFlashcardsCreatorStore = create<FlashcardsCreatorStore>((set) => ({
  // State
  flashcardBoards: { is: `idle` },
  creation: { is: `idle` },
  activeFlashcards: FLASHCARD_BOARDS[2].flashcards,
  activeFlashcardId: null,
  // Actions
  activateFlashcard: (id) => {
    set({ activeFlashcardId: id });
  },
  initCreation: () => {
    set({ creation: { is: `started` } });
  },
  disactivateFlashcard: () => {
    set({ activeFlashcardId: null });
  },
  // Acts
  loadBoards: async () => {
    try {
      set({ flashcardBoards: { is: `busy` } });

      const pagination: Pagination = { page: 1, limit: 10 };

      const { flashcardBoards } = await mock()<
        API4MarkdownDto<'getYourFlashcardBoards'>
      >({
        flashcardBoards: FLASHCARD_BOARDS,
        page: 1,
        totalPages: 10,
      })<API4MarkdownPayload<'getYourFlashcardBoards'>>(pagination);

      set({ flashcardBoards: { is: `ok`, flashcardBoards, ...pagination } });
    } catch (error: unknown) {
      set({ flashcardBoards: { is: `fail`, error: parseError(error) } });
    }
  },
}));

export { useFlashcardsCreatorStore };
