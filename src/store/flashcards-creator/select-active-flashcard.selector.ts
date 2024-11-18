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

export { selectActiveFlashcard };
