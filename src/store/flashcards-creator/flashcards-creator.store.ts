import { create } from 'zustand';
import type { FlashcardsCreatorStoreState } from './flashcards-creator.store-models';
import { FLASHCARD_BOARDS } from '__mocks__/flashcard-boards.mocks';

const useFlashcardsCreatorStore = create<FlashcardsCreatorStoreState>(() => ({
  flashcards: FLASHCARD_BOARDS[2].flashcards,
}));

export { useFlashcardsCreatorStore };
