import React from 'react';
import Markdown from 'components/markdown';
import { BiBookContent, BiSave, BiSolidBookContent, BiX } from 'react-icons/bi';
import { Button } from 'design-system/button';
import { usePortal } from 'development-kit/use-portal';
import { ImageUploaderContainer } from 'features/creator/containers/image-uploader.container';
import TemplatesPopover from 'features/creator/components/templates-popover';
import { useFlashcardsCreatorStore } from 'store/flashcards-creator/flashcards-creator.store';
import { Bar } from 'design-system/bar';
import { useCreatorManagement } from 'core/use-creator-management';
import c from 'classnames';
import { selectSafeActiveFlashcard } from 'store/flashcards-creator/select-safe-active-flashcard.selector';
import { useOnEscapePress } from 'development-kit/use-on-escape-press';
import { resetActiveFlashcard } from 'store/flashcards-creator/actions/reset-active-flashcard.action';

const FlashcardEditorModalContainer = () => {
  const { render } = usePortal();
  const activeFlashcard = useFlashcardsCreatorStore(selectSafeActiveFlashcard);

  const initialCode = activeFlashcard.content;

  const [code, setCode] = React.useState(initialCode);

  const {
    divide,
    divideMode,
    creatorRef,
    changeCode,
    maintainTabs,
    scrollToHeading,
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

  useOnEscapePress(resetActiveFlashcard);

  const unchanged = code === initialCode;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const heading = React.useMemo(() => initialCode.split(`\n`)[0], []);

  return render(
    <div className="[&>*]:animate-fade-in flex md:flex-col flex-col-reverse fixed top-0 left-0 right-0 z-10 h-[100svh] dark:bg-black bg-white dark:bg-opacity-60 bg-opacity-40 backdrop-blur-2xl">
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
        <h6 className="text-lg font-bold mr-4">{heading}</h6>
        <Button
          i={1}
          s={1}
          title="Save changes"
          disabled={unchanged}
          onClick={confirmSave}
        >
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

export { FlashcardEditorModalContainer };
