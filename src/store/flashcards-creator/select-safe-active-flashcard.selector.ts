import type { FlashcardDto } from 'api-4markdown-contracts';
import type { FlashcardsCreatorStoreState } from './flashcards-creator.store-models';
import { selectActiveFlashcard } from './select-active-flashcard.selector';

const selectSafeActiveFlashcard = (
  state: FlashcardsCreatorStoreState,
): FlashcardDto => {
  const result = selectActiveFlashcard(state);

  if (result === null) throw Error(`Invalid read attempt`);

  return result;
};

export { selectSafeActiveFlashcard };
