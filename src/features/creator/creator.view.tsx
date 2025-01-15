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
import throttle from 'lodash.throttle';
import { isMd } from 'design-system/viewports';
import debounce from 'lodash.debounce';
import { usePortal } from 'development-kit/use-portal';
import MoreNav from 'components/more-nav';
import UserPopover from 'components/user-popover';
import { CreatorToolbox } from './components/creator-toolbox';
import { DocBarContainer } from './containers/doc-bar.container';
import { Button } from 'design-system/button';
import { BiWindows } from 'react-icons/bi';
import { Link } from 'gatsby';

const CreatorErrorModalContainer = React.lazy(
  () => import(`./containers/creator-error-modal.container`),
);

const useMobileSection = () => {
  const [opened, setOpened] = React.useState(true);

  React.useEffect(() => {
    let isMdViewport = isMd();

    const getScrollY = (): number =>
      window.scrollY || document.documentElement.scrollTop;

    let prevY = getScrollY();

    const manageMobileSection = throttle((): void => {
      if (isMdViewport) return;

      const y = getScrollY();

      const totalHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

      const progress = Number.parseFloat(((y / totalHeight) * 100).toFixed(2));

      const isGoingTop = prevY > y;
      const isNearBottom = progress > 90;

      setOpened(isGoingTop || isNearBottom);

      prevY = y;
    }, 150);

    const determineViewport = debounce((): void => {
      isMdViewport = isMd();
      setOpened(true);
    }, 500);

    window.addEventListener(`scroll`, manageMobileSection);
    window.addEventListener(`resize`, determineViewport);

    return () => {
      window.removeEventListener(`scroll`, manageMobileSection);
      window.addEventListener(`resize`, determineViewport);
      manageMobileSection.cancel();
      determineViewport.cancel();
    };
  }, []);

  return [opened, setOpened] as const;
};

const CreatorView = () => {
  const [mobileSectionVisible] = useMobileSection();

  const { render } = usePortal();

  useCreatorLocalStorageSync();

  const docManagementStore = useDocManagementStore();
  const { code, initialCode } = useDocumentCreatorState();
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>();
  const creatorRef = React.useRef<HTMLTextAreaElement>(null);

  const [scrollToPreview] = useScrollToPreview();

  const clearConfirm = useConfirm(() => changeAction(``));
  const resetConfirm = useConfirm(() => changeAction(initialCode));

  const triggerPreviewScroll = async (
    input: HTMLTextAreaElement,
  ): Promise<void> => {
    const DESKTOP_WIDTH = 1024;

    if (window.innerWidth < DESKTOP_WIDTH) {
      return;
    }

    scrollToPreview(input);
  };

  const maintainTabs: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === `Tab`) {
      e.preventDefault();
    }

    triggerPreviewScroll(e.currentTarget);
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
      {docManagementStore.is === `fail` && (
        <React.Suspense>
          <CreatorErrorModalContainer />
        </React.Suspense>
      )}
      {render(
        <div
          className={c(
            `flex dark:bg-black bg-white fixed bottom-[122px] md:top-[122px] md:bottom-0 left-0 right-0 md:right-[50%] h-[260px] md:h-[calc(100%-122px)] border-t border-zinc-300 dark:border-zinc-800 md:border-t-0 border-r-0 md:border-r transition-all`,
            { 'translate-y-0': mobileSectionVisible },
            { 'translate-y-full': !mobileSectionVisible },
          )}
        >
          <header className="h-full flex-col gap-2 border-zinc-300 dark:border-zinc-800 border-r py-4 px-2.5 hidden md:flex">
            <CreatorToolbox creator={creatorRef.current} />
          </header>
          <label className="hidden" htmlFor="creator" id="creator">
            Creator
          </label>
          <textarea
            className="resize-none w-full h-full bg-transparent focus:outline-none p-4 md:text-base text-sm"
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
          ></textarea>
        </div>,
      )}
      {render(
        <header
          className={c(
            `flex flex-col-reverse md:flex-col fixed bg-zinc-100 dark:bg-gray-950 bottom-0 md:top-0 md:bottom-[unset] left-0 right-0 transition-all`,
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
      <main className="md:mt-[122px] mb-[382px] md:mb-0">
        <Markdown className="mr-auto ml-auto md:!max-w-[50%] md:mr-0 p-4">
          {code}
        </Markdown>
      </main>
    </>
  );
};

export default CreatorView;
