import { AppNavigation } from 'components/app-navigation';
import { AppFooterContainer } from 'containers/app-footer.container';
import { CreationLinkContainer } from 'containers/creation-link.container';
import { DocsBrowseLinkContainer } from 'containers/docs-browse-link.container';
import React from 'react';
import { createInitialCode } from '../../../create-initial-code';
import Markdown from 'components/markdown';
import { BiPlusCircle } from 'react-icons/bi';
import { Button } from 'design-system/button';

const mock = {
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
    </>
  );
};

export { FlashcardsCreatorView };
