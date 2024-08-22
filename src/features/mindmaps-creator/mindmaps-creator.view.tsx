import React from 'react';
import { Button } from 'design-system/button';
import { BiArrowBack, BiPlus } from 'react-icons/bi';

const MindmapsCreatorView = () => {
  return (
    <>
      <header className="flex px-4 py-3.5 border-b-2 bg-zinc-200 dark:bg-gray-950 border-zinc-300 dark:border-zinc-800">
        <Button i={1} s={2} title="Back to home page">
          <BiArrowBack />
        </Button>
      </header>
      <main className="flex h-[calc(100svh-70px)]">
        <aside className="flex flex-col space-y-4 shrink-0 px-4 py-3.5 border-r-2 bg-zinc-200 dark:bg-gray-950 border-zinc-300 dark:border-zinc-800">
          <Button i={1} s={2} title="Create new mindmap node">
            <BiPlus />
          </Button>
        </aside>
        <section>Content</section>
      </main>
    </>
  );
};

export { MindmapsCreatorView };
