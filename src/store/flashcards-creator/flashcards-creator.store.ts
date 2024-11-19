import { create } from 'zustand';
import { FLASHCARD_BOARDS } from '__mocks__/flashcard-boards.mocks';
import type { FlashcardDto } from 'api-4markdown-contracts';
import type { Transaction } from 'development-kit/utility-types';

type FlashcardsCreatorStoreState = {
  flashcards: FlashcardDto[];
  activeFlashcardId: FlashcardDto['id'] | null;
  creation: Transaction;
  creationStarted: boolean;
};

const useFlashcardsCreatorStore = create<FlashcardsCreatorStoreState>(() => ({
  flashcards: FLASHCARD_BOARDS[2].flashcards,
  activeFlashcardId: null,
  creation: { is: `idle` },
  creationStarted: false,
}));

const { setState, getState } = useFlashcardsCreatorStore;

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

const flashcardsCreatorStoreSelectors = {
  state: (): FlashcardsCreatorStoreState => getState(),
  useState: (): FlashcardsCreatorStoreState => useFlashcardsCreatorStore(),
  useActiveFlashcard: (): FlashcardDto | null =>
    useFlashcardsCreatorStore(selectActiveFlashcard),
  useSafeActiveFlashcard: (): FlashcardDto =>
    useFlashcardsCreatorStore(selectSafeActiveFlashcard),
};

const flashcardsCreatorStoreActions = {
  set: (state: Partial<FlashcardsCreatorStoreState>): void => setState(state),
  resetActiveFlashcard: (): void => setState({ activeFlashcardId: null }),
  setActiveFlashcard: (
    id: FlashcardsCreatorStoreState['activeFlashcardId'],
  ): void =>
    setState({
      activeFlashcardId: id,
    }),
  setCreation: (creation: FlashcardsCreatorStoreState['creation']): void => {
    setState({ creation });
  },
  startCreation: (): void => {
    setState({ creationStarted: true });
  },
  endCreation: (): void => {
    const { creation } = flashcardsCreatorStoreSelectors.state();

    if (creation.is === `busy`) return;

    setState({ creationStarted: false });
  },
};

export {
  useFlashcardsCreatorStore,
  flashcardsCreatorStoreSelectors,
  flashcardsCreatorStoreActions,
};
export type { FlashcardsCreatorStoreState };
