// import { getAPI } from 'api-4markdown';
import { parseError } from 'development-kit/parse-error';
import { useYourFlashcardBoardsStore } from './your-flashcard-boards.store';
import type { YourFlashcardBoardsStoreState } from './your-flashcard-boards.store-models';
import type {
  API4MarkdownDto,
  API4MarkdownPayload,
  Pagination,
} from 'api-4markdown-contracts';
import { mock } from 'development-kit/mock';
import { FLASHCARD_BOARDS } from '__mocks__/flashcard-boards.mocks';

const { setState } = useYourFlashcardBoardsStore;

const set = (state: YourFlashcardBoardsStoreState): void => {
  setState(state);
};

const loadYourFlashcaradBoards = async (): Promise<void> => {
  try {
    set({ is: `loading` });

    const paginated: Pagination = { page: 1, limit: 10 };

    const { flashcardBoards } = await mock()<
      API4MarkdownDto<'getYourFlashcardBoards'>
    >({
      flashcardBoards: FLASHCARD_BOARDS,
      page: 1,
      totalPages: 10,
    })<API4MarkdownPayload<'getYourFlashcardBoards'>>(paginated);
    // const { flashcardBoards } = await getAPI().call(`getYourFlashcardBoards`)(
    //   paginated,
    // );

    set({ is: `loaded`, flashcardBoards, ...paginated });
  } catch (error: unknown) {
    set({ is: `load-fail`, error: parseError(error) });
  }
};

export { loadYourFlashcaradBoards };
