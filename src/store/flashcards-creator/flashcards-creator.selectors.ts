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
}: FlashcardsCreatorStoreState): Extract<
  FlashcardsCreatorStoreState['flashcardBoards'],
  { is: 'ok' }
> => {
  if (flashcardBoards.is === `ok`) return flashcardBoards;

  throw Error(`Invalid state read attempt`);
};

const selectActiveFlashcardsBoard = (
  state: FlashcardsCreatorStoreState,
): FlashcardsBoardDto => {
  const flashcardBoards = selectFlashcardBoards(state);

  const foundFlashcardsBoard = flashcardBoards.data.find(
    (flashcardsBoard) => flashcardsBoard.id === state.activeFlashcardsBoardId,
  );

  if (!foundFlashcardsBoard) throw Error(`Cannot find active flashcards board`);

  return foundFlashcardsBoard;
};

export {
  selectActiveFlashcard,
  selectFlashcardBoards,
  selectActiveFlashcardsBoard,
};
