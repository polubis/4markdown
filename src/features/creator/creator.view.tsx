import React, {
  type ChangeEventHandler,
  type KeyboardEventHandler,
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
import { usePortal } from 'development-kit/use-portal';
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
import { useToggle } from 'development-kit/use-toggle';
import { Status } from 'design-system/status';

const CreatorErrorModalContainer = React.lazy(
  () => import(`./containers/creator-error-modal.container`),
);

const CheatSheetModal = React.lazy(() =>
  import(`./components/cheatsheet-modal`).then((m) => ({
    default: m.CheatSheetModal,
  })),
);

const CreatorView = () => {
  const [copyState, copy] = useCopy();
  const cheatsheetModal = useToggle();
  const [scrollToPreview] = useScrollToPreview();
  const [view, setView] = React.useState<`creator` | `preview`>(`preview`);

  const { render } = usePortal();

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

    scrollToPreview(e.currentTarget);
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
      cheatsheetModal.open();
    }
  };

  const toggleView = (): void => {
    setView((prevView) => (prevView === `preview` ? `creator` : `preview`));
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
      {cheatsheetModal.opened && (
        <React.Suspense>
          <CheatSheetModal onClose={cheatsheetModal.close} />
        </React.Suspense>
      )}
      {render(
        <div
          className={c(
            view === `preview` ? `translate-x-full` : `translate-x-0`,
            `md:translate-x-0 transition-transform flex dark:bg-black bg-white fixed top-0 md:top-[122px] left-0 right-0 md:right-[50%] h-[calc(100%-122px)] border-zinc-300 dark:border-zinc-800 border-r-0 md:border-r`,
          )}
        >
          <header className="h-full flex flex-col gap-1.5 border-zinc-300 dark:border-zinc-800 border-r py-3 px-2.5 overflow-y-auto flex-shrink-0">
            <CreatorToolbox
              creator={creatorRef.current}
              onClick={handleToolboxItemClick}
            />
          </header>
          <label className="hidden" htmlFor="creator" id="creator">
            Creator
          </label>
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
              scrollToPreview(e.currentTarget);
            }}
          />
        </div>,
      )}
      {render(
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
        </header>,
      )}
      <main className="md:mt-[122px] md:mb-0 mb-[122px]">
        <Markdown className="markdown mr-auto ml-auto md:!max-w-[50%] md:mr-0 p-4">
          {code}
        </Markdown>
      </main>
    </>
  );
};

export default CreatorView;
