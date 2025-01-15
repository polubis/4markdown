import React, {
  type ChangeEventHandler,
  type KeyboardEventHandler,
} from 'react';
import { Markdown } from 'components/markdown';
import {
  BiBold,
  BiBookContent,
  BiCode,
  BiHeading,
  BiInfoCircle,
  BiItalic,
  BiLink,
  BiListCheck,
  BiListOl,
  BiListUl,
  BiMath,
  BiSolidBookContent,
  BiSolidQuoteAltLeft,
  BiStrikethrough,
  BiWindows,
} from 'react-icons/bi';
import { Button } from 'design-system/button';
import c from 'classnames';
import { useConfirm } from 'development-kit/use-confirm';
import AddDocPopover from 'components/add-doc-popover';
import { useDocManagementStore } from 'store/doc-management/doc-management.store';
import { DocBarContainer } from './containers/doc-bar.container';
import { ImageUploaderContainer } from './containers/image-uploader.container';
import { CreatorNavigation } from './components/creator-navigation';
import { meta } from '../../../meta';
import { useCreatorLocalStorageSync } from 'core/use-creator-local-storage-sync';
import { changeAction } from 'store/document-creator/actions';
import { useDocumentCreatorState } from 'store/document-creator';
import { useCopy } from 'development-kit/use-copy';
import { Status } from 'design-system/status';
import { useToggle } from 'development-kit/use-toggle';
import { useScrollToPreview } from './utils/use-scroll-to-preview';
import throttle from 'lodash.throttle';
import { isMd } from 'design-system/viewports';
import debounce from 'lodash.debounce';
import { usePortal } from 'development-kit/use-portal';
import MoreNav from 'components/more-nav';
import UserPopover from 'components/user-popover';

const headerSectionClasses = `px-4 border-t md:border-b md:border-t-0 border-zinc-300 dark:border-zinc-800 flex items-center`;

const CreatorErrorModalContainer = React.lazy(
  () => import(`./containers/creator-error-modal.container`),
);

const CheatsheetModal = React.lazy(() =>
  import(`./components/cheatsheet-modal`).then((m) => ({
    default: m.CheatSheetModal,
  })),
);

type DivideMode = 'both' | 'preview' | 'code';

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

  const [copyState, copy] = useCopy();

  const docManagementStore = useDocManagementStore();
  const [divideMode, setDivideMode] = React.useState<DivideMode>(`both`);
  const { code, initialCode } = useDocumentCreatorState();
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>();
  const creatorRef = React.useRef<HTMLTextAreaElement>(null);

  const [scrollToPreview] = useScrollToPreview();

  const clearConfirm = useConfirm(() => changeAction(``));
  const resetConfirm = useConfirm(() => changeAction(initialCode));

  const cheatsheetModal = useToggle();

  const triggerPreviewScroll = async (
    input: HTMLTextAreaElement,
  ): Promise<void> => {
    const DESKTOP_WIDTH = 1024;

    if (divideMode !== `both` || window.innerWidth < DESKTOP_WIDTH) {
      return;
    }

    scrollToPreview(input);
  };

  const divide = (): void => {
    if (divideMode === `both`) {
      setDivideMode(`code`);
      return;
    }

    if (divideMode === `code`) {
      setDivideMode(`preview`);
      return;
    }

    setDivideMode(`both`);
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
    setDivideMode(`code`);
    window.open(
      meta.routes.creator.preview,
      `_blank`,
      `width=${screen.availWidth},height=${screen.availHeight}`,
    );
  };

  const insertMarkdownSyntax =
    (
      syntax:
        | `heading`
        | `bold`
        | `italic`
        | `strike`
        | `quote`
        | `code`
        | `math`
        | `link`
        | `ol`
        | `ul`
        | `todo`,
    ) =>
    (): void => {
      const creator = creatorRef.current;

      if (!creator) return;

      const operationsMap: Record<typeof syntax, () => void> = {
        heading: () => {
          copy(`### `);
        },
        bold: () => {
          copy(`** **`);
        },
        italic: () => {
          copy(`* *`);
        },
        strike: () => {
          copy(`~~ ~~`);
        },
        quote: () => {
          copy(`> `);
        },
        code: () => {
          copy(`\`\`\`\n\n\`\`\``);
        },
        math: () => {
          copy(`$$\n\n$$`);
        },
        link: () => {
          copy(`![]()`);
        },
        ol: () => {
          copy(`1. \n2. \n3. `);
        },
        ul: () => {
          copy(`- \n- \n- `);
        },
        todo: () => {
          copy(`- [x] a\n- [ ] b\n- [x] c`);
        },
      };

      operationsMap[syntax]();
    };

  React.useEffect(() => {
    const creatorField = creatorRef.current;

    if (creatorField) {
      creatorField.value = code;
    }
  }, [code, divideMode]);

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
          <CheatsheetModal onClose={cheatsheetModal.close} />
        </React.Suspense>
      )}
      {render(
        <div
          className={c(
            `flex dark:bg-black bg-white fixed bottom-[122px] md:top-[122px] md:bottom-0 left-0 right-0 md:right-[50%] h-[260px] md:h-full border-t border-zinc-300 dark:border-zinc-800 md:border-t-0 transition-all`,
            { 'translate-y-0': mobileSectionVisible },
            { 'translate-y-full': !mobileSectionVisible },
          )}
        >
          <header className="w-[50px] h-full flex justify-center border-zinc-300 dark:border-zinc-800 border-r py-4">
            xd
          </header>
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
              `h-[72px] justify-between px-4 border-t md:border-b md:border-t-0 border-zinc-300 dark:border-zinc-800 flex items-center`,
            )}
          >
            <nav className="flex items-center gap-2">
              <ImageUploaderContainer />
            </nav>
            <nav className="flex items-center gap-2">
              <UserPopover />
              <MoreNav />
            </nav>
          </div>
          <div
            className={c(
              `h-[50px] px-4 border-t md:border-b md:border-t-0 border-zinc-300 dark:border-zinc-800 flex items-center`,
            )}
          >
            bottom
          </div>
        </header>,
      )}
      <main className="md:mt-[122px] mb-[388px] md:mb-0">
        <Markdown className="mr-auto ml-auto md:!max-w-[50%] md:mr-0 p-4">
          {code}
        </Markdown>
      </main>
      {/* <main className="flex md:flex-col flex-col-reverse">
        <CreatorNavigation>
          <AddDocPopover />
          <ImageUploaderContainer />
          <Button i={1} s={2} title="Change view display" onClick={divide}>
            {divideMode === `both` && (
              <BiBookContent className="rotate-90 md:rotate-0" />
            )}
            {divideMode === `code` && (
              <BiSolidBookContent className="rotate-90 md:rotate-180" />
            )}
            {divideMode === `preview` && (
              <BiSolidBookContent className="-rotate-90 md:rotate-0" />
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
        </CreatorNavigation>
        <DocBarContainer />
        <section
          className={c(`grid h-[calc(100svh-72px-50px)]`, {
            'md:grid-cols-2 grid-cols-1 grid-rows-2 md:grid-rows-1':
              divideMode === `both`,
            'grid-cols-1 grid-rows-1': divideMode !== `both`,
          })}
        >
          <div
            className={c(`flex flex-col`, {
              hidden: divideMode === `preview`,
            })}
          >
            <header
              className={c(
                `flex items-center h-[50px] gap-1 px-3 border-b-2 border-zinc-300 dark:border-zinc-800 overflow-x-auto`,
              )}
            >
              <Button
                s="auto"
                className="p-1"
                i={1}
                title="Heading"
                onClick={insertMarkdownSyntax(`heading`)}
              >
                <BiHeading size={20} />
              </Button>
              <Button
                s="auto"
                className="p-1"
                i={1}
                title="Bold"
                onClick={insertMarkdownSyntax(`bold`)}
              >
                <BiBold size={20} />
              </Button>
              <Button
                s="auto"
                className="p-1"
                i={1}
                title="Italic"
                onClick={insertMarkdownSyntax(`italic`)}
              >
                <BiItalic size={20} />
              </Button>
              <Button
                s="auto"
                className="p-1"
                i={1}
                title="Quote"
                onClick={insertMarkdownSyntax(`quote`)}
              >
                <BiSolidQuoteAltLeft size={20} />
              </Button>
              <Button
                s="auto"
                className="p-1"
                i={1}
                title="Striketrough"
                onClick={insertMarkdownSyntax(`strike`)}
              >
                <BiStrikethrough size={20} />
              </Button>
              <div className="h-4 border-l border-zinc-300 dark:border-zinc-800 mx-1" />
              <Button
                s="auto"
                className="p-1"
                i={1}
                title="Code"
                onClick={insertMarkdownSyntax(`code`)}
              >
                <BiCode size={20} />
              </Button>
              <Button
                s="auto"
                className="p-1"
                i={1}
                title="Math / Latex syntax"
                onClick={insertMarkdownSyntax(`math`)}
              >
                <BiMath size={20} />
              </Button>
              <Button
                s="auto"
                className="p-1"
                i={1}
                title="Link"
                onClick={insertMarkdownSyntax(`link`)}
              >
                <BiLink size={20} />
              </Button>
              <div className="h-4 border-l border-zinc-300 dark:border-zinc-800 mx-1" />
              <Button
                s="auto"
                className="p-1"
                i={1}
                title="Ordered list"
                onClick={insertMarkdownSyntax(`ol`)}
              >
                <BiListOl size={20} />
              </Button>
              <Button
                s="auto"
                className="p-1"
                i={1}
                title="Unordered list"
                onClick={insertMarkdownSyntax(`ul`)}
              >
                <BiListUl size={20} />
              </Button>
              <Button
                s="auto"
                className="p-1"
                i={1}
                title="Task list"
                onClick={insertMarkdownSyntax(`todo`)}
              >
                <BiListCheck size={20} />
              </Button>
              <div className="h-4 border-l border-zinc-300 dark:border-zinc-800 mx-1" />
              <Button
                s="auto"
                className="p-1"
                i={1}
                title="Cheatsheet"
                onClick={cheatsheetModal.open}
              >
                <BiInfoCircle size={20} />
              </Button>
            </header>
            <label className="hidden" htmlFor="creator" id="creator">
              Creator
            </label>
            <textarea
              ref={creatorRef}
              aria-labelledby="creator"
              defaultValue={code}
              aria-label="creator"
              spellCheck="false"
              className={c(
                `p-4 border-r-0 h-full resize-none bg-transparent focus:outline-none text-lg`,
              )}
              onChange={changeCode}
              onKeyDown={maintainTabs}
              onClick={(e) => {
                scrollToPreview(e.currentTarget);
              }}
            />
          </div>
          <Markdown
            className={c(
              `markdown w-full p-4 overflow-auto border-zinc-300 dark:border-zinc-800`,
              { hidden: divideMode === `code` },
              { 'mx-auto': divideMode === `preview` },
              {
                'md:border-l-2 row-start-1 md:row-start-auto border-b-2 md:border-b-0 !max-w-full':
                  divideMode === `both`,
              },
            )}
          >
            {code}
          </Markdown>
        </section>
      </main> */}
    </>
  );
};

export default CreatorView;
