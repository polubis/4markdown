import React from 'react';
import Markdown from 'components/markdown';
import { BiPlus, BiX } from 'react-icons/bi';
import { Button } from 'design-system/button';
import { usePortal } from 'development-kit/use-portal';
import { ImageUploaderContainer } from 'features/creator/containers/image-uploader.container';
import TemplatesPopover from 'features/creator/components/templates-popover';
import { CreatorNavigation } from 'features/creator/components/creator-navigation';
import { useFlashcardsCreatorStore } from 'store/flashcards-creator/flashcards-creator.store';
import { Bar } from 'design-system/bar';
import {
  FlashcardsCreatorProvider,
  useFlashcardsCreatorContext,
} from './flashcards-creator.provider';

const FlashcardEditor = () => {
  const { render } = usePortal();
  const { activeFlashcard } = useFlashcardsCreatorContext();

  if (!activeFlashcard.data) throw Error(`Lack of parent protection for data`);

  return render(
    <div className="[&>*]:animate-fade-in flex md:flex-col flex-col-reverse fixed top-0 left-0 right-0 z-10 h-[100svh] dark:bg-black bg-white dark:bg-opacity-60 bg-opacity-20 backdrop-blur-2xl">
      <header className="border-t-2 md:border-b-2 md:border-t-0 gap-3 flex items-center overflow-x-auto py-2 pl-4 pr-0 sm:pr-4 bg-zinc-200 dark:bg-gray-950 h-[72px] border-zinc-300 dark:border-zinc-800">
        <ImageUploaderContainer />
        <TemplatesPopover />
        <Button className="ml-auto" i={1} s={2} onClick={activeFlashcard.close}>
          <BiX size="28" />
        </Button>
      </header>
      <Bar className="h-[50px]">
        <h6 className="text-lg font-bold">
          {activeFlashcard.data.content.split(`\n`)[0]}
        </h6>
      </Bar>
      <div className="grid h-[calc(100svh-72px-50px)] md:grid-cols-2 grid-cols-1 grid-rows-2 md:grid-rows-1">
        <section>
          <label
            className="hidden"
            htmlFor="flashcard-creator"
            id="flashcard-creator"
          >
            Flashcard Creator
          </label>
          <textarea
            aria-labelledby="flashcard-creator"
            aria-label="flashcard-creator"
            spellCheck="false"
            value={activeFlashcard.data.content}
            className="p-4 border-r-0 resize-none focus:outline-none text-lg bg-transparent text-black dark:text-white w-full h-full"
          />
        </section>
        <section className="p-4 overflow-y-auto">
          <Markdown>{activeFlashcard.data.content}</Markdown>
        </section>
      </div>
    </div>,
  );
};

const FlashcardsCreatorView = () => {
  const { flashcards } = useFlashcardsCreatorStore();
  const { activeFlashcard } = useFlashcardsCreatorContext();

  return (
    <>
      <main className="flex md:flex-col flex-col-reverse">
        <CreatorNavigation>
          <Button
            i={1}
            s={2}
            title="Create new flashcards board"
            onClick={() => {}}
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
                onClick={() => activeFlashcard.openWithData(flashcard)}
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
      {activeFlashcard.data && <FlashcardEditor />}
    </>
  );
};

const FlashcardsCreatorConnectedView = () => (
  <FlashcardsCreatorProvider>
    <FlashcardsCreatorView />
  </FlashcardsCreatorProvider>
);

export { FlashcardsCreatorConnectedView as FlashcardsCreatorView };
