import React from 'react';
import Markdown from 'components/markdown';
import { BiPlus } from 'react-icons/bi';
import { Button } from 'design-system/button';
import { CreatorNavigation } from 'features/creator/components/creator-navigation';
import { useFlashcardsCreatorStore } from 'store/flashcards-creator/flashcards-creator.store';
import { Bar } from 'design-system/bar';
import { selectActiveFlashcard } from 'store/flashcards-creator/flashcards-creator.selectors';
import { setActiveFlashcard } from 'store/flashcards-creator/flashcards-creator.actions';
import { useToggle } from 'development-kit/use-toggle';

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

const FlashcardsCreatorView = () => {
  const { flashcards } = useFlashcardsCreatorStore();
  const activeFlashcard = useFlashcardsCreatorStore(selectActiveFlashcard);
  const creationModal = useToggle();

  return (
    <>
      <main className="flex md:flex-col flex-col-reverse">
        <CreatorNavigation>
          <Button
            i={1}
            s={2}
            title="Create new flashcards board"
            onClick={creationModal.open}
          >
            <BiPlus />
          </Button>
        </CreatorNavigation>
        <Bar className="h-[50px]">
          <h6 className="text-lg font-bold">Flashcards Board</h6>
        </Bar>
        <section className="relative h-[calc(100svh-72px-50px)]">
          <ul className="grid grid-cols-3 gap-6 grid-row-3 p-8 h-full absolute top-0 left-0 overflow-y-auto">
            {flashcards.map((flashcard, index) => (
              <li
                className="cursor-pointer relative p-4 h-[300px] border-2 rounded-lg border-zinc-300 dark:border-zinc-800 overflow-hidden"
                key={flashcard.id}
                onClick={() => setActiveFlashcard(flashcard.id)}
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
      {activeFlashcard && (
        <React.Suspense>
          <FlashcardEditorModalContainer />
        </React.Suspense>
      )}
      {creationModal.opened && (
        <React.Suspense>
          <CreateFlashcardsBoardModalContainer
            onClose={creationModal.close}
            onSuccess={creationModal.close}
          />
        </React.Suspense>
      )}
    </>
  );
};

export { FlashcardsCreatorView };
