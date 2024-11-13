import { AppNavigation } from 'components/app-navigation';
import { AppFooterContainer } from 'containers/app-footer.container';
import { CreationLinkContainer } from 'containers/creation-link.container';
import { DocsBrowseLinkContainer } from 'containers/docs-browse-link.container';
import React from 'react';
import { createInitialCode } from '../../../create-initial-code';
import Markdown from 'components/markdown';
import { BiPlusCircle } from 'react-icons/bi';
import { Button } from 'design-system/button';
import { useToggle } from 'development-kit/use-toggle';
import { usePortal } from 'development-kit/use-portal';
import c from 'classnames';
import Modal from 'design-system/modal';

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
  ],
};

const FlashcardsCreatorView = () => {
  const activeFlashcard = useToggle<Flashcard>();

  const { render } = usePortal();

  return (
    <>
      <AppNavigation>
        <CreationLinkContainer />
        <DocsBrowseLinkContainer />
      </AppNavigation>
      <main className="py-10 px-8">
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
          <div
            className={c(
              `grid fixed top-0 left-0 h-100svh md:grid-cols-2 grid-cols-1 grid-rows-2 md:grid-rows-1`,
            )}
          >
            <label className="hidden" htmlFor="creator" id="creator">
              Creator
            </label>
            <textarea
              aria-labelledby="creator"
              aria-label="creator"
              spellCheck="false"
              className={c(
                `p-4 border-r-0 resize-none focus:outline-none dark:bg-black bg-white text-lg text-black dark:text-white`,
              )}
              // onChange={changeCode}
              // onKeyDown={maintainTabs}
              // onClick={(e) => {
              //   loadAndScroll(e.target as HTMLTextAreaElement);
              // }}
            />
            <div
              className={c(
                `p-4 overflow-auto border-zinc-300 dark:bg-black bg-white dark:border-zinc-800 md:border-l-2 row-start-1 md:row-start-auto border-b-2 md:border-b-0`,
              )}
            >
              <Markdown>{activeFlashcard.data?.content}</Markdown>
            </div>
          </div>,
        )}
    </>
  );
};

export { FlashcardsCreatorView };
