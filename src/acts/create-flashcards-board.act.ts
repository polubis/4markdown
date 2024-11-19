import type {
  API4MarkdownDto,
  API4MarkdownPayload,
} from 'api-4markdown-contracts';
import { mock } from 'development-kit/mock';
import { PRIVATE_FLASHCARDS_BOARD } from '__mocks__/flashcard-boards.mocks';
import { parseError } from 'development-kit/parse-error';
import {
  flashcardsCreatorStoreActions,
  useFlashcardsCreatorStore,
} from 'store/flashcards-creator/flashcards-creator.store';

const createFlashcardsBoardAct = async (values: {
  name: API4MarkdownPayload<'createFlashcardsBoard'>['name'];
  description: NonNullable<
    API4MarkdownPayload<'createFlashcardsBoard'>['description']
  >;
}): Promise<void> => {
  try {
    const { flashcards } = useFlashcardsCreatorStore.getState();

    flashcardsCreatorStoreActions.setCreation({ is: `busy` });

    await mock()<API4MarkdownDto<'createFlashcardsBoard'>>(
      PRIVATE_FLASHCARDS_BOARD,
    )<API4MarkdownPayload<'createFlashcardsBoard'>>({
      ...values,
      flashcards,
    });

    flashcardsCreatorStoreActions.set({
      creation: { is: `ok` },
      creationStarted: false,
    });
  } catch (error: unknown) {
    flashcardsCreatorStoreActions.setCreation({
      is: `fail`,
      error: parseError(error),
    });
  }
};

export { createFlashcardsBoardAct };
