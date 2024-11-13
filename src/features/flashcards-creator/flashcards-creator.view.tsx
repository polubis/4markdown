import { AppFooterContainer } from 'containers/app-footer.container';
import React from 'react';
import { createInitialCode } from '../../../create-initial-code';
import Markdown from 'components/markdown';
import { BiPlusCircle, BiX } from 'react-icons/bi';
import { Button } from 'design-system/button';
import { useToggle } from 'development-kit/use-toggle';
import { usePortal } from 'development-kit/use-portal';
import { ImageUploaderContainer } from 'features/creator/containers/image-uploader.container';
import TemplatesPopover from 'features/creator/components/templates-popover';
import { CreatorNavigation } from 'features/creator/components/creator-navigation';
import AddDocPopover from 'components/add-doc-popover';

type Flashcard = {
  id: number;
  content: string;
};

type FlashcardsBoard = {
  id: number;
  name: string;
  description: string;
  url: string;
  cards: Flashcard[];
};

const mock: FlashcardsBoard = {
  id: 0,
  name: `How to Master TypeScript`,
  description: `Making dasdasd dassadasd asada dasadad dasdsadsa dasds`,
  url: `/how-to-master-typescript/`,
  cards: [
    { id: 0, content: createInitialCode() },
    { id: 1, content: createInitialCode() },
    { id: 2, content: createInitialCode() },
    { id: 3, content: createInitialCode() },
    { id: 4, content: createInitialCode() },
    { id: 5, content: createInitialCode() },
    { id: 6, content: createInitialCode() },
    { id: 7, content: createInitialCode() },
    { id: 8, content: createInitialCode() },
    { id: 9, content: createInitialCode() },
  ],
};

const FlashcardsCreatorView = () => {
  const activeFlashcard = useToggle<Flashcard>();

  const { render } = usePortal();

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-10">
        <CreatorNavigation>
          <AddDocPopover />
        </CreatorNavigation>
      </div>
      <main className="pb-10 pt-[112px] px-8">
        <ul className="grid grid-cols-3 gap-6 grid-row-3">
          <li className="flex items-center justify-center" key="create">
            <Button i={2} s={2} auto>
              Add Flashcard
              <BiPlusCircle />
            </Button>
          </li>
          {mock.cards.map((card, index) => (
            <li
              className="relative p-4 h-[300px] border-2 rounded-lg border-zinc-300 dark:border-zinc-800 overflow-hidden"
              key={card.id}
              onClick={() => activeFlashcard.openWithData(card)}
            >
              <strong className="absolute dark:opacity-10 opacity-15 text-6xl top-0 right-2">
                {index + 1}
              </strong>
              <Markdown>{card.content}</Markdown>
            </li>
          ))}
        </ul>
      </main>
      <AppFooterContainer />
      {activeFlashcard.data &&
        render(
          <div className="fixed top-0 left-0 right-0 z-10 h-[100svh] bg-black bg-opacity-60 backdrop-blur-2xl">
            <header className="flex gap-4 items-center px-4 h-[72px]">
              <Button i={1} s={2}>
                <BiX />
              </Button>
              <ImageUploaderContainer />
              <TemplatesPopover />
            </header>
            <div className="grid h-[calc(100svh-72px)] md:grid-cols-2 grid-cols-1 grid-rows-2 md:grid-rows-1">
              <section>
                <label className="hidden" htmlFor="creator" id="creator">
                  Creator
                </label>
                <textarea
                  aria-labelledby="creator"
                  aria-label="creator"
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
        )}
    </>
  );
};

export { FlashcardsCreatorView };
