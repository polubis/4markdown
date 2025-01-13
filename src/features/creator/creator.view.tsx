import React from 'react';
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
import { TemplatesPopover } from './components/templates-popover';
import AddDocPopover from 'components/add-doc-popover';
import { useDocManagementStore } from 'store/doc-management/doc-management.store';
import { DocBarContainer } from './containers/doc-bar.container';
import { ImageUploaderContainer } from './containers/image-uploader.container';
import { CreatorNavigation } from './components/creator-navigation';
import { meta } from '../../../meta';
import { useCreatorLocalStorageSync } from 'core/use-creator-local-storage-sync';
import { changeAction } from 'store/document-creator/actions';
import { useDocumentCreatorState } from 'store/document-creator';

const CreatorErrorModalContainer = React.lazy(
  () => import(`./containers/creator-error-modal.container`),
);

type DivideMode = 'both' | 'preview' | 'code';

const CreatorView = () => {
  useCreatorLocalStorageSync();

  const docManagementStore = useDocManagementStore();
  const [divideMode, setDivideMode] = React.useState<DivideMode>(`both`);
  const { code, initialCode } = useDocumentCreatorState();
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>();
  const creatorRef = React.useRef<HTMLTextAreaElement>(null);

  const clearConfirm = useConfirm(() => changeAction(``));
  const resetConfirm = useConfirm(() => changeAction(initialCode));

  const triggerPreviewScroll = async (
    input: HTMLTextAreaElement,
  ): Promise<void> => {
    const DESKTOP_WIDTH = 1024;

    if (divideMode !== `both` || window.innerWidth < DESKTOP_WIDTH) {
      return;
    }

    const { scrollToCreatorPreview } = await import(
      `./utils/scroll-to-creator-preview`
    );

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

  const maintainTabs: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    const target = e.target as HTMLTextAreaElement;

    triggerPreviewScroll(target);

    if (e.key !== `Tab`) {
      return;
    }

    e.preventDefault();

    const start = target.selectionStart;
    const end = target.selectionEnd;

    const newValue =
      code.substring(0, start) + ` `.repeat(4) + code.substring(end);

    changeAction(newValue);

    target.selectionStart = target.selectionEnd = start + 1;
  };

  const changeCode: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
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
      {docManagementStore.is === `fail` && (
        <React.Suspense>
          <CreatorErrorModalContainer />
        </React.Suspense>
      )}
      <main className="flex md:flex-col flex-col-reverse">
        <CreatorNavigation>
          <AddDocPopover />
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
        </CreatorNavigation>
        <DocBarContainer />
        <section
          className={c(`grid h-[calc(100svh-72px-50px)]`, {
            'md:grid-cols-2 grid-cols-1 grid-rows-2 md:grid-rows-1':
              divideMode === `both`,
          })}
        >
          <div className="flex flex-col">
            <header
              className={c(
                `flex items-center h-[48px] gap-1 px-3 border-b-2 border-zinc-300 dark:border-zinc-800 overflow-x-auto`,
              )}
            >
              <Button s="auto" className="p-1" i={1} title="Heading">
                <BiHeading size={20} />
              </Button>
              <Button s="auto" className="p-1" i={1} title="Bold">
                <BiBold size={20} />
              </Button>
              <Button s="auto" className="p-1" i={1} title="Italic">
                <BiItalic size={20} />
              </Button>
              <Button s="auto" className="p-1" i={1} title="Quote">
                <BiSolidQuoteAltLeft size={20} />
              </Button>
              <Button s="auto" className="p-1" i={1} title="Striketrough">
                <BiStrikethrough size={20} />
              </Button>
              <div className="h-4 border-l border-zinc-300 dark:border-zinc-800 mx-1" />
              <ImageUploaderContainer />
              <Button s="auto" className="p-1" i={1} title="Code">
                <BiCode size={20} />
              </Button>
              <Button
                s="auto"
                className="p-1"
                i={1}
                title="Math / Latex syntax"
              >
                <BiMath size={20} />
              </Button>
              <Button s="auto" className="p-1" i={1} title="Link">
                <BiLink size={20} />
              </Button>
              <div className="h-4 border-l border-zinc-300 dark:border-zinc-800 mx-1" />
              <Button s="auto" className="p-1" i={1} title="Ordered list">
                <BiListOl size={20} />
              </Button>
              <Button s="auto" className="p-1" i={1} title="Unordered list">
                <BiListUl size={20} />
              </Button>
              <Button s="auto" className="p-1" i={1} title="Task list">
                <BiListCheck size={20} />
              </Button>
              <div className="h-4 border-l border-zinc-300 dark:border-zinc-800 mx-1" />
              <Button s="auto" className="p-1" i={1} title="Cheatsheet">
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
                `p-4 border-r-0 h-full resize-none focus:outline-none dark:bg-black bg-white text-lg text-black dark:text-white`,
                { hidden: divideMode === `preview` },
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
              `w-full p-4 overflow-auto border-zinc-300 dark:border-zinc-800`,
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
