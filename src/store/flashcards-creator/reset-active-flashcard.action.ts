import { useFlashcardsCreatorStore } from './flashcards-creator.store';

const resetActiveFlashcard = (): void => {
  useFlashcardsCreatorStore.setState({ activeFlashcardId: null });
};

export { resetActiveFlashcard };
