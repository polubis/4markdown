import type {
  API4MarkdownDto,
  API4MarkdownPayload,
} from 'api-4markdown-contracts';
import { useFlashcardsCreatorStore } from '../flashcards-creator.store';
import type { FlashcardsCreatorStoreState } from '../flashcards-creator.store-models';
import { mock } from 'development-kit/mock';
import { PRIVATE_FLASHCARDS_BOARD } from '__mocks__/flashcard-boards.mocks';
import { parseError } from 'development-kit/parse-error';

const setCreation = (
  creation: FlashcardsCreatorStoreState['creation'],
): void => {
  useFlashcardsCreatorStore.setState({ creation });
};

const createFlashcardsBoard = async (values: {
  name: API4MarkdownPayload<'createFlashcardsBoard'>['name'];
  description: NonNullable<
    API4MarkdownPayload<'createFlashcardsBoard'>['description']
  >;
}): Promise<void> => {
  try {
    const { flashcards } = useFlashcardsCreatorStore.getState();

    setCreation({ is: `busy` });

    await mock()<API4MarkdownDto<'createFlashcardsBoard'>>(
      PRIVATE_FLASHCARDS_BOARD,
    )<API4MarkdownPayload<'createFlashcardsBoard'>>({
      ...values,
      flashcards,
    });

    setCreation({ is: `ok` });
  } catch (error: unknown) {
    setCreation({ is: `fail`, error: parseError(error) });
  }
};

export { createFlashcardsBoard };
