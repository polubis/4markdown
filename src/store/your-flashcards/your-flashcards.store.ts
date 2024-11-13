import type { FlashcardsDto } from 'api-4markdown-contracts';
import type { Transaction } from 'development-kit/utility-types';
import { create } from 'zustand';

type YourFlashcardsStoreState = {
  flashcards: Transaction<FlashcardsDto>;
  activeItem?: number;
};

const useYourFlashcardsStore = create(() => ({}));

export { useYourFlashcardsStore };
