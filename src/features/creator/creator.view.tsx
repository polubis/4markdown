import React, {
  type ChangeEventHandler,
  type KeyboardEventHandler,
  type ReactEventHandler,
} from 'react';
import { Markdown } from 'components/markdown';
import c from 'classnames';
import { useConfirm } from 'development-kit/use-confirm';
import AddDocPopover from 'components/add-doc-popover';
import { useDocManagementStore } from 'store/doc-management/doc-management.store';
import { ImageUploaderContainer } from './containers/image-uploader.container';
import { meta } from '../../../meta';
import { useCreatorLocalStorageSync } from 'core/use-creator-local-storage-sync';
import { changeAction } from 'store/document-creator/actions';
import { useDocumentCreatorState } from 'store/document-creator';
import { useScrollToPreview } from './utils/use-scroll-to-preview';
import MoreNav from 'components/more-nav';
import UserPopover from 'components/user-popover';
import {
  CreatorToolbox,
  type CreatorToolboxProps,
} from './components/creator-toolbox';
import { DocBarContainer } from './containers/doc-bar.container';
import { Button } from 'design-system/button';
import { BiSolidBookContent, BiWindows } from 'react-icons/bi';
import { Link } from 'gatsby';
import { useCopy } from 'development-kit/use-copy';
import { Status } from 'design-system/status';
import { useSimpleFeature } from '@greenonsoftware/react-kit';
import {
  getSelectedText,
  isInvalidSelection,
} from 'development-kit/textarea-utils';

const CreatorErrorModalContainer = React.lazy(
  () => import(`./containers/creator-error-modal.container`),
);

const CheatSheetModal = React.lazy(() =>
  import(`./components/cheatsheet-modal`).then((m) => ({
    default: m.CheatSheetModal,
  })),
);

const CreationAssistantModule = React.lazy(() =>
  import(`../../modules/creation-assistant/creation-assistant.module`).then(
    (m) => ({
      default: m.CreationAssistantModule,
    }),
  ),
);

const CreatorView = () => {
  const [copyState, copy] = useCopy();
  const cheatsheetModal = useSimpleFeature();
  const autoScroller = useScrollToPreview();
  const assistant = useSimpleFeature();
  const [view, setView] = React.useState<`creator` | `preview`>(`preview`);

  useCreatorLocalStorageSync();

  const docManagementStore = useDocManagementStore();
  const { code, initialCode } = useDocumentCreatorState();

  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>();
  const creatorRef = React.useRef<HTMLTextAreaElement>(null);

  const clearConfirm = useConfirm(() => changeAction(``));
  const resetConfirm = useConfirm(() => changeAction(initialCode));

  const maintainTabs: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === `Tab`) {
      e.preventDefault();
    }

    autoScroller.scroll(e.currentTarget);
  };

  const changeCode: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    const timeout = timeoutRef.current;

    timeout && clearTimeout(timeout);

    timeoutRef.current = setTimeout(() => {
      changeAction(e.target.value);
    }, 750);
  };

  const openNewWindow = (): void => {
    window.open(
      meta.routes.creator.preview,
      `_blank`,
      `width=${screen.availWidth},height=${screen.availHeight}`,
    );
  };

  const handleToolboxItemClick: CreatorToolboxProps['onClick'] = (syntax) => {
    if (syntax) {
      copy(syntax);
    } else {
      cheatsheetModal.on();
    }
  };

  const toggleView = (): void => {
    setView((prevView) => (prevView === `preview` ? `creator` : `preview`));
  };

  const maintainSuggestionAppearance: ReactEventHandler<HTMLTextAreaElement> = (
    e,
  ) => {
    const textarea = e.currentTarget;
    const selectedText = getSelectedText(textarea);

    if (isInvalidSelection(textarea) || !selectedText) {
      assistant.off();
      return;
    }

    const wordsCount = selectedText.replace(/[^a-zA-Z0-9]/g, ``).length;

    const minWordsCount = 1;

    if (wordsCount < minWordsCount) {
      assistant.off();
      return;
    }

    assistant.on();
  };

  React.useEffect(() => {
    const creatorField = creatorRef.current;

    if (creatorField) {
      creatorField.value = code;
    }
  }, [code]);

  React.useEffect(() => {
    const timeout = timeoutRef.current;

    return () => {
      timeout && clearTimeout(timeout);
    };
  }, []);

  return (
    <>
      {copyState.is === `copied` && (
        <Status>Copied! Now put cursor in creator and paste</Status>
      )}
      {docManagementStore.is === `fail` && (
        <React.Suspense>
          <CreatorErrorModalContainer />
        </React.Suspense>
      )}
      {cheatsheetModal.isOn && (
        <React.Suspense>
          <CheatSheetModal onClose={cheatsheetModal.off} />
        </React.Suspense>
      )}
      <main className="md:mt-[122px] md:mb-0 mb-[122px]">
        <Markdown className="markdown mr-auto ml-auto md:!max-w-[50%] md:mr-0 p-4">
          {code}
        </Markdown>
      </main>
      <div
        className={c(
          view === `preview` ? `translate-x-full` : `translate-x-0`,
          `md:translate-x-0 transition-transform flex dark:bg-black bg-white fixed top-0 md:top-[122px] left-0 right-0 md:right-[50%] h-[calc(100%-122px)] border-zinc-300 dark:border-zinc-800 border-r-0 md:border-r`,
        )}
      >
        <header className="h-full flex flex-col gap-1.5 border-zinc-300 dark:border-zinc-800 border-r py-3 px-2.5 overflow-y-auto flex-shrink-0">
          <Button
            title="Turn on/off auto scrolling"
            i={1}
            s={1}
            className={c({
              '!text-green-700 dark:!text-green-400': autoScroller.isOn,
            })}
            onClick={autoScroller.toggle}
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="fill-current"
                d="M9.17184 16.8179L7.75684 18.2319L11.9998 22.4749L16.2428 18.2319L14.8278 16.8179L11.9998 19.6469L9.17184 16.8179ZM14.8278 7.1819L16.2428 5.7679L11.9998 1.5249L7.75684 5.7679L9.17184 7.1819L11.9998 4.3539L14.8278 7.1819Z"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 9C12.7956 9 13.5587 9.31607 14.1213 9.87868C14.6839 10.4413 15 11.2044 15 12C15 12.7956 14.6839 13.5587 14.1213 14.1213C13.5587 14.6839 12.7956 15 12 15C11.2044 15 10.4413 14.6839 9.87868 14.1213C9.31607 13.5587 9 12.7956 9 12C9 11.2044 9.31607 10.4413 9.87868 9.87868C10.4413 9.31607 11.2044 9 12 9ZM12 11C12.2652 11 12.5196 11.1054 12.7071 11.2929C12.8946 11.4804 13 11.7348 13 12C13 12.2652 12.8946 12.5196 12.7071 12.7071C12.5196 12.8946 12.2652 13 12 13C11.7348 13 11.4804 12.8946 11.2929 12.7071C11.1054 12.5196 11 12.2652 11 12C11 11.7348 11.1054 11.4804 11.2929 11.2929C11.4804 11.1054 11.7348 11 12 11Z"
                className="fill-current"
              />
            </svg>
          </Button>
          <CreatorToolbox
            creator={creatorRef.current}
            onClick={handleToolboxItemClick}
          />
        </header>
        <label className="hidden" htmlFor="creator" id="creator">
          Creator
        </label>
        <div className="relative w-full h-full">
          <textarea
            className="resize-none w-full h-full dark:bg-black bg-white focus:outline-none p-4 md:text-base text-sm"
            ref={creatorRef}
            aria-labelledby="creator"
            defaultValue={code}
            aria-label="creator"
            spellCheck="false"
            onChange={changeCode}
            onKeyDown={maintainTabs}
            onClick={(e) => {
              autoScroller.scroll(e.currentTarget);
            }}
            onSelect={maintainSuggestionAppearance}
          />
          {assistant.isOn && (
            <React.Suspense>
              <CreationAssistantModule onClose={assistant.off} />
            </React.Suspense>
          )}
        </div>
      </div>
      <header
        className={c(
          `flex flex-col-reverse md:flex-col fixed bottom-0 md:top-0 md:bottom-[unset] left-0 right-0 bg-zinc-50 dark:bg-zinc-950`,
        )}
      >
        <div
          className={c(
            `h-[72px] px-4 border-t md:border-b md:border-t-0 border-zinc-300 dark:border-zinc-800 flex justify-between gap-2`,
          )}
        >
          <nav className="flex items-center gap-2">
            <Link
              to={meta.routes.home}
              className="shrink-0 sm:flex hidden mr-2"
            >
              <img
                className="w-8 h-8"
                rel="preload"
                src="/favicon-32x32.png"
                alt="Logo"
              />
            </Link>
            <AddDocPopover />
            <ImageUploaderContainer />
            <Button
              className="flex md:hidden"
              title="Start editing markdown"
              i={1}
              s={2}
              onClick={toggleView}
            >
              {view === `creator` && <BiSolidBookContent />}
              {view === `preview` && (
                <BiSolidBookContent className="rotate-180" />
              )}
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
              i={1}
              s={2}
              auto
              className="md:flex hidden"
              disabled={code === ``}
              title="Clear content"
              onClick={clearConfirm.confirm}
            >
              {clearConfirm.isOn ? `Sure?` : `Clear`}
            </Button>
            <Button
              i={1}
              s={2}
              auto
              className="md:flex hidden"
              disabled={code === initialCode}
              title="Reset content"
              onClick={resetConfirm.confirm}
            >
              {resetConfirm.isOn ? `Sure?` : `Reset`}
            </Button>
          </nav>
          <div />
          <nav className="flex items-center gap-2">
            <UserPopover />
            <MoreNav />
          </nav>
        </div>
        <nav
          className={c(
            `h-[50px] px-4 border-t md:border-b md:border-t-0 border-zinc-300 dark:border-zinc-800 flex items-center`,
          )}
        >
          <DocBarContainer />
        </nav>
      </header>
    </>
  );
};

export default CreatorView;
