import { FLASHCARD_BOARDS } from '__mocks__/flashcard-boards.mocks';
import type {
  API4MarkdownDto,
  API4MarkdownPayload,
  Pagination,
} from 'api-4markdown-contracts';
import { mock } from 'development-kit/mock';
import { parseError } from 'development-kit/parse-error';
import { yourFlashcardBoardsStoreActions } from 'store/your-flashcard-boards/your-flashcard-boards.store';

const loadYourFlashcardBoardsAct = async (): Promise<void> => {
  try {
    yourFlashcardBoardsStoreActions.set({ is: `loading` });

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

    yourFlashcardBoardsStoreActions.set({
      is: `loaded`,
      flashcardBoards,
      ...paginated,
    });
  } catch (error: unknown) {
    yourFlashcardBoardsStoreActions.set({
      is: `load-fail`,
      error: parseError(error),
    });
  }
};

export { loadYourFlashcardBoardsAct };
