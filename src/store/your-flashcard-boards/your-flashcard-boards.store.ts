import { create } from 'zustand';
import type { YourFlashcardBoardsStoreState } from './your-flashcard-boards.store-models';

const useYourFlashcardBoardsStore = create<YourFlashcardBoardsStoreState>(
  () => ({
    is: `idle`,
  }),
);

export { useYourFlashcardBoardsStore };
