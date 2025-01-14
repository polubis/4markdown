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
import { scrollToCreatorPreview } from './utils/scroll-to-creator-preview';

const CreatorErrorModalContainer = React.lazy(
  () => import(`./containers/creator-error-modal.container`),
);

const CheatsheetModal = React.lazy(() =>
  import(`./components/cheatsheet-modal`).then((m) => ({
    default: m.CheatSheetModal,
  })),
);

type DivideMode = 'both' | 'preview' | 'code';

const CreatorView = () => {
  useCreatorLocalStorageSync();

  const [copyState, copy] = useCopy();

  const docManagementStore = useDocManagementStore();
  const [divideMode, setDivideMode] = React.useState<DivideMode>(`both`);
  const { code, initialCode } = useDocumentCreatorState();
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>();
  const creatorRef = React.useRef<HTMLTextAreaElement>(null);

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

    scrollToCreatorPreview(input);
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

    const target = e.target as HTMLTextAreaElement;

    triggerPreviewScroll(target);
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
      <main className="flex md:flex-col flex-col-reverse">
        <CreatorNavigation>
          <AddDocPopover />
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
              <ImageUploaderContainer />
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
                triggerPreviewScroll(e.target as HTMLTextAreaElement);
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
      </main>
    </>
  );
};

export default CreatorView;
