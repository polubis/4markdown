import React from 'react';
import Markdown from 'components/markdown';
import { BiPlus } from 'react-icons/bi';
import { Button } from 'design-system/button';
import { CreatorNavigation } from 'features/creator/components/creator-navigation';
import { useFlashcardsCreatorStore } from 'store/flashcards-creator/flashcards-creator.store';
import { useAuthStore } from 'store/auth/auth.store';
import { FlashcardsBoardMaintenanceBarContainer } from './containers/flashcards-board-maintenance-bar.container';

const FlashcardEditorModalContainer = React.lazy(() =>
  import(`./containers/flashcard-editor-modal.container`).then((m) => ({
    default: m.FlashcardEditorModalContainer,
  })),
);

const CreateFlashcardsBoardModalContainer = React.lazy(() =>
  import(`./containers/create-flashcards-board-modal.container`).then((m) => ({
    default: m.CreateFlashcardsBoardModalContainer,
  })),
);

const BrowseFlashcardBoardsModalContainer = React.lazy(() =>
  import(`./containers/browse-flashcard-boards-modal.container`).then((m) => ({
    default: m.BrowseFlashcardBoardsModalContainer,
  })),
);
// Handle pagination loading
// Handle transition state and disabling for pagination loading
// Display save button if it's changed
// Connect save button for changing flashcard boards
// Allow to unmark flashcard board
// Allow to refetch flashcards board
// Allow to delete flashcard board
// Improve each flashcard UX/UI
// Add option to update status and visibility
// Add option to update name
// Add RWD support
// Add unsafed work alert
// Add empty name if cannot add flashcard.
const FlashcardsCreatorView = () => {
  const authStore = useAuthStore();
  const {
    startCreation,
    activateFlashcard,
    flashcardBoardsVisible,
    activeFlashcards,
    flashcardsBoardCreation,
    activeFlashcardId,
  } = useFlashcardsCreatorStore();

  React.useEffect(() => {
    authStore.is === `authorized` &&
      useFlashcardsCreatorStore.getState().loadBoards();
  }, [authStore]);

  return (
    <>
      <main className="flex md:flex-col flex-col-reverse">
        <CreatorNavigation>
          <Button
            i={1}
            s={2}
            title="Create new flashcards board"
            onClick={startCreation}
          >
            <BiPlus />
          </Button>
        </CreatorNavigation>
        <FlashcardsBoardMaintenanceBarContainer />
        <section className="relative h-[calc(100svh-72px-50px)]">
          <ul className="grid grid-cols-3 gap-6 grid-row-3 p-8 h-full absolute top-0 left-0 overflow-y-auto">
            {activeFlashcards.map((flashcard, index) => (
              <li
                className="cursor-pointer relative p-4 h-[300px] border-2 rounded-lg border-zinc-300 dark:border-zinc-800 overflow-hidden"
                key={flashcard.id}
                onClick={() => activateFlashcard(flashcard.id)}
              >
                <strong className="absolute dark:opacity-10 opacity-15 text-6xl top-0 right-2">
                  {index + 1}
                </strong>
                <div className="pointer-events-none select-none">
                  <Markdown>{flashcard.content}</Markdown>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
      {activeFlashcardId !== null && (
        <React.Suspense>
          <FlashcardEditorModalContainer />
        </React.Suspense>
      )}
      {flashcardsBoardCreation.is !== `idle` && (
        <React.Suspense>
          <CreateFlashcardsBoardModalContainer />
        </React.Suspense>
      )}
      {flashcardBoardsVisible && (
        <React.Suspense>
          <BrowseFlashcardBoardsModalContainer />
        </React.Suspense>
      )}
    </>
  );
};

export { FlashcardsCreatorView };
