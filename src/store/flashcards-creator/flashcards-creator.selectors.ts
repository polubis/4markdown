import type { FlashcardDto } from 'api-4markdown-contracts';
import type { FlashcardsCreatorStoreState } from './flashcards-creator.store-models';

const selectActiveFlashcard = ({
  activeFlashcardId,
  flashcards,
}: FlashcardsCreatorStoreState): FlashcardDto | null => {
  return activeFlashcardId === null
    ? null
    : (flashcards.find((flashcard) => flashcard.id === activeFlashcardId) ??
        null);
};

const selectSafeActiveFlashcard = (
  state: FlashcardsCreatorStoreState,
): FlashcardDto => {
  const result = selectActiveFlashcard(state);

  if (result === null) throw Error(`Invalid read attempt`);

  return result;
};

export { selectActiveFlashcard, selectSafeActiveFlashcard };
