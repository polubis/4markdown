import React from 'react';
import Markdown from 'components/markdown';
import {
  BiBookContent,
  BiPlus,
  BiSave,
  BiSolidBookContent,
  BiWindows,
  BiX,
} from 'react-icons/bi';
import { Button } from 'design-system/button';
import { usePortal } from 'development-kit/use-portal';
import { ImageUploaderContainer } from 'features/creator/containers/image-uploader.container';
import TemplatesPopover from 'features/creator/components/templates-popover';
import { CreatorNavigation } from 'features/creator/components/creator-navigation';
import { useFlashcardsCreatorStore } from 'store/flashcards-creator/flashcards-creator.store';
import { Bar } from 'design-system/bar';
import { useCreatorManagement } from 'core/use-creator-management';
import c from 'classnames';
import {
  selectActiveFlashcard,
  selectSafeActiveFlashcard,
} from 'store/flashcards-creator/flashcards-creator.selectors';
import {
  resetActiveFlashcard,
  setActiveFlashcard,
} from 'store/flashcards-creator/flashcards-creator.actions';

const FlashcardEditor = () => {
  const { render } = usePortal();
  const activeFlashcard = useFlashcardsCreatorStore(selectSafeActiveFlashcard);

  const data = activeFlashcard!;
  const initialCode = data.content;

  const [code, setCode] = React.useState(initialCode);

  const {
    divide,
    divideMode,
    creatorRef,
    changeCode,
    maintainTabs,
    scrollToHeading,
    openNewWindow,
    clearConfirm,
    resetConfirm,
  } = useCreatorManagement({
    code,
    initialCode,
    onChange: setCode,
  });

  const confirmSave = (): void => {
    resetActiveFlashcard();
  };

  return render(
    <div className="[&>*]:animate-fade-in flex md:flex-col flex-col-reverse fixed top-0 left-0 right-0 z-10 h-[100svh] dark:bg-black bg-white dark:bg-opacity-60 bg-opacity-20 backdrop-blur-2xl">
      <header className="border-t-2 md:border-b-2 md:border-t-0 gap-3 flex items-center overflow-x-auto py-2 pl-4 pr-0 sm:pr-4 bg-zinc-200 dark:bg-gray-950 h-[72px] border-zinc-300 dark:border-zinc-800">
        <ImageUploaderContainer />
        <TemplatesPopover />
        <Button i={1} s={2} title="Change view display" onClick={divide}>
          {divideMode === `both` && (
            <BiBookContent className="rotate-90 md:rotate-0" />
          )}
          {divideMode === `code` && (
            <BiSolidBookContent className="rotate-180" />
          )}
          {divideMode === `preview` && <BiSolidBookContent />}
        </Button>
        <Button
          className="md:flex hidden"
          title="Open in separate window"
          i={1}
          s={2}
          onClick={openNewWindow}
        >
          <BiWindows />
        </Button>
        <Button
          i={2}
          s={2}
          auto
          className="md:flex hidden"
          disabled={code === ``}
          title="Clear content"
          onClick={clearConfirm.confirm}
        >
          {clearConfirm.opened ? `Sure?` : `Clear`}
        </Button>
        <Button
          i={2}
          s={2}
          auto
          className="md:flex hidden"
          disabled={code === initialCode}
          title="Reset content"
          onClick={resetConfirm.confirm}
        >
          {resetConfirm.opened ? `Sure?` : `Reset`}
        </Button>
        <Button className="ml-auto" i={1} s={2} onClick={resetActiveFlashcard}>
          <BiX size="28" />
        </Button>
      </header>
      <Bar className="h-[50px]">
        <h6 className="text-lg font-bold mr-4">
          {data.content.split(`\n`)[0]}
        </h6>
        <Button i={1} s={1} title="Save changes" onClick={confirmSave}>
          <BiSave />
        </Button>
      </Bar>
      <section
        className={c(`grid h-[calc(100svh-72px-50px)]`, {
          'md:grid-cols-2 grid-cols-1 grid-rows-2 md:grid-rows-1':
            divideMode === `both`,
        })}
      >
        <label
          className="hidden"
          htmlFor="flashcards-creator"
          id="flashcards-creator"
        >
          Flashcards Creator
        </label>
        <textarea
          ref={creatorRef}
          aria-labelledby="flashcards-creator"
          aria-label="flashcards-creator"
          spellCheck="false"
          className={c(
            `p-4 border-r-0 resize-none focus:outline-none bg-transparent text-lg text-black dark:text-white`,
            { hidden: divideMode === `preview` },
          )}
          onChange={changeCode}
          onKeyDown={maintainTabs}
          onClick={(e) => {
            scrollToHeading(e.target as HTMLTextAreaElement);
          }}
        />
        <div
          className={c(
            `p-4 overflow-auto border-zinc-300 dark:border-zinc-800`,
            { hidden: divideMode === `code` },
            { 'max-w-4xl mx-auto': divideMode === `preview` },
            {
              'md:border-l-2 row-start-1 md:row-start-auto border-b-2 md:border-b-0':
                divideMode === `both`,
            },
          )}
        >
          <Markdown>{code}</Markdown>
        </div>
      </section>
    </div>,
  );
};

const FlashcardsCreatorView = () => {
  const { flashcards } = useFlashcardsCreatorStore();
  const activeFlashcard = useFlashcardsCreatorStore(selectActiveFlashcard);

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
      {activeFlashcard && <FlashcardEditor />}
    </>
  );
};

export { FlashcardsCreatorView };
