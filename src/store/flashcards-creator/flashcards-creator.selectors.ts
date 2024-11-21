import type { FlashcardDto } from 'api-4markdown-contracts';
import type { FlashcardsCreatorStoreState } from './flashcards-creator.models';

const selectActiveFlashcard = ({
  activeFlashcardId,
  activeFlashcards,
}: FlashcardsCreatorStoreState): FlashcardDto => {
  if (activeFlashcardId === null) throw Error(`Invalid state read attempt`);

  const activeFlashcard = activeFlashcards.find(
    (flashcard) => flashcard.id === activeFlashcardId,
  );

  if (activeFlashcard === undefined) throw Error(`Cannot find flashcard`);

  return activeFlashcard;
};

const selectFlashcardBoards = ({
  flashcardBoards,
}: FlashcardsCreatorStoreState): Extract<
  FlashcardsCreatorStoreState['flashcardBoards'],
  { is: 'ok' | 'all-loaded' }
> => {
  if (
    flashcardBoards.is === `idle` ||
    flashcardBoards.is === `busy` ||
    flashcardBoards.is === `fail` ||
    flashcardBoards.is === `loading-more`
  )
    throw Error(`Invalid state read attempt`);

  return flashcardBoards;
};

export { selectActiveFlashcard, selectFlashcardBoards };
