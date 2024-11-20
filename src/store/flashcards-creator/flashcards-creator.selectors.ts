import type { FlashcardDto, FlashcardsBoardDto } from 'api-4markdown-contracts';
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
}: FlashcardsCreatorStoreState): FlashcardsBoardDto[] => {
  if (
    flashcardBoards.is === `idle` ||
    flashcardBoards.is === `busy` ||
    flashcardBoards.is === `fail`
  )
    throw Error(`Invalid state read attempt`);

  return flashcardBoards.data;
};

export { selectActiveFlashcard, selectFlashcardBoards };
