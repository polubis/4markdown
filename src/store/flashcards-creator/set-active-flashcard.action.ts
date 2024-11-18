import { useFlashcardsCreatorStore } from './flashcards-creator.store';
import type { FlashcardsCreatorStoreState } from './flashcards-creator.store-models';

const setActiveFlashcard = (
  id: FlashcardsCreatorStoreState['activeFlashcardId'],
): void => {
  useFlashcardsCreatorStore.setState({ activeFlashcardId: id });
};

export { setActiveFlashcard };
