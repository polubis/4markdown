import { create } from 'zustand';
import type { FlashcardsBoardDto, Pagination } from 'api-4markdown-contracts';
import { type ParsedError } from 'development-kit/parse-error';

type YourFlashcardBoardsStoreState =
  | {
      is: `idle`;
    }
  | { is: `loading` }
  | {
      is: `load-fail`;
      error: ParsedError;
    }
  | ((
      | { is: `loading-more`; flashcardBoards: FlashcardsBoardDto[] }
      | { is: `all-loaded`; flashcardBoards: FlashcardsBoardDto[] }
      | {
          is: `load-more-fail`;
          error: ParsedError;
          flashcardBoards: FlashcardsBoardDto[];
        }
      | { is: `loaded`; flashcardBoards: FlashcardsBoardDto[] }
    ) &
      Pagination);

const useYourFlashcardBoardsStore = create<YourFlashcardBoardsStoreState>(
  () => ({
    is: `idle`,
  }),
);

const { setState } = useYourFlashcardBoardsStore;

const yourFlashcardBoardsStoreActions = {
  set: (state: YourFlashcardBoardsStoreState): void => {
    setState(state);
  },
};

export { useYourFlashcardBoardsStore, yourFlashcardBoardsStoreActions };
export type { YourFlashcardBoardsStoreState };
