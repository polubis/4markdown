import {
  FLASHCARD_BOARDS,
  PRIVATE_FLASHCARDS_BOARD,
} from '__mocks__/flashcard-boards.mocks';
import { parseError } from 'api-4markdown';
import type {
  API4MarkdownDto,
  API4MarkdownPayload,
  Pagination,
} from 'api-4markdown-contracts';
import { mock } from 'development-kit/mock';
import { create } from 'zustand';
import type { FlashcardsCreatorStore } from './flashcards-creator.models';

const useFlashcardsCreatorStore = create<FlashcardsCreatorStore>(
  (set, get) => ({
    // State
    flashcardBoards: { is: `idle` },
    flashcardsBoardCreation: { is: `idle` },
    activeFlashcards: FLASHCARD_BOARDS[2].flashcards,
    activeFlashcardId: null,
    // Actions
    activateFlashcard: (id) => {
      set({ activeFlashcardId: id });
    },
    startCreation: () => {
      set({ flashcardsBoardCreation: { is: `started` } });
    },
    disactivateFlashcard: () => {
      set({ activeFlashcardId: null });
    },
    resetCreation: () => {
      set({ flashcardsBoardCreation: { is: `idle` } });
    },
    // Acts
    loadBoards: async () => {
      const state = get();

      if (state.flashcardBoards.is !== `idle`) return;

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
    createBoard: async (values) => {
      try {
        const { activeFlashcards } = get();

        set({ flashcardsBoardCreation: { is: `busy` } });

        await mock()<API4MarkdownDto<'createFlashcardsBoard'>>(
          PRIVATE_FLASHCARDS_BOARD,
        )<API4MarkdownPayload<'createFlashcardsBoard'>>({
          ...values,
          flashcards: activeFlashcards,
        });

        set({ flashcardsBoardCreation: { is: `ok` } });
      } catch (error: unknown) {
        set({
          flashcardsBoardCreation: { is: `fail`, error: parseError(error) },
        });
      }
    },
  }),
);

export { useFlashcardsCreatorStore };
