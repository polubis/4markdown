import React from 'react';
import Markdown from 'components/markdown';
import { BiBookContent, BiSolidBookContent, BiWindows } from 'react-icons/bi';
import { Button } from 'design-system/button';
import c from 'classnames';
import { useConfirm } from 'development-kit/use-confirm';
import TemplatesPopover from './components/templates-popover';
import AddDocPopover from 'components/add-doc-popover';
import { DocBarContainer } from './containers/doc-bar.container';
import { ImageUploaderContainer } from './containers/image-uploader.container';
import { meta } from '../../../meta';
import {
  divideDisplay,
  setCode,
  setDisplay,
  useDocumentsCreatorState,
} from '../../store/documents-creator/documents-creator.store';
import { Navigation } from 'components/navigation';

const CreatorErrorModalContainer = React.lazy(() =>
  import(`./containers/creator-error-modal.container`).then((m) => ({
    default: m.CreatorErrorModalContainer,
  })),
);

const CreatorView = () => {
  const { initialCode, code, display, error } = useDocumentsCreatorState();

  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>();
  const creatorRef = React.useRef<HTMLTextAreaElement>(null);

  const clearConfirm = useConfirm(() => setCode(``));
  const resetConfirm = useConfirm(() => setCode(initialCode));

  const loadAndScroll = async (input: HTMLTextAreaElement): Promise<void> => {
    const DESKTOP_WIDTH = 1024;

    if (display !== `both` || window.innerWidth < DESKTOP_WIDTH) {
      return;
    }

    const { scrollToCreatorPreview } = await import(
      `./utils/scroll-to-creator-preview`
    );

    scrollToCreatorPreview(input);
  };

  const maintainTabs: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    const target = e.target as HTMLTextAreaElement;

    loadAndScroll(target);

    if (e.key !== `Tab`) {
      return;
    }

    e.preventDefault();

    const start = target.selectionStart;
    const end = target.selectionEnd;

    const newValue =
      code.substring(0, start) + ` ` + ` ` + ` ` + ` ` + code.substring(end);

    setCode(newValue);

    target.selectionStart = target.selectionEnd = start + 1;
  };

  const setCodeWithDelay: React.ChangeEventHandler<HTMLTextAreaElement> = (
    e,
  ) => {
    const timeout = timeoutRef.current;

    timeout && clearTimeout(timeout);

    timeoutRef.current = setTimeout(() => {
      setCode(e.target.value);
    }, 750);
  };

  const openNewWindow = (): void => {
    setDisplay(`code`);
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
  }, [code, display]);

  React.useEffect(() => {
    const timeout = timeoutRef.current;

    return () => {
      timeout && clearTimeout(timeout);
    };
  }, []);

  return (
    <>
      {error && (
        <React.Suspense>
          <CreatorErrorModalContainer />
        </React.Suspense>
      )}
      <main className="flex md:flex-col flex-col-reverse">
        <Navigation className="border-t-2 md:border-b-2 md:border-t-0">
          <AddDocPopover />
          <ImageUploaderContainer />
          <TemplatesPopover />
          <Button
            i={1}
            s={2}
            title="Change view display"
            onClick={divideDisplay}
          >
            {display === `both` && (
              <BiBookContent className="rotate-90 md:rotate-0" />
            )}
            {display === `code` && (
              <BiSolidBookContent className="rotate-180" />
            )}
            {display === `preview` && <BiSolidBookContent />}
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
        </Navigation>

        <DocBarContainer />
        <section
          className={c(`grid h-[calc(100svh-72px-50px)]`, {
            'md:grid-cols-2 grid-cols-1 grid-rows-2 md:grid-rows-1':
              display === `both`,
          })}
        >
          <label className="hidden" htmlFor="creator" id="creator">
            Creator
          </label>
          <textarea
            ref={creatorRef}
            aria-labelledby="creator"
            aria-label="creator"
            spellCheck="false"
            className={c(
              `p-4 border-r-0 resize-none focus:outline-none dark:bg-black bg-white text-lg text-black dark:text-white`,
              { hidden: display === `preview` },
            )}
            onChange={setCodeWithDelay}
            onKeyDown={maintainTabs}
            onClick={(e) => {
              loadAndScroll(e.target as HTMLTextAreaElement);
            }}
          />
          <div
            className={c(
              `p-4 overflow-auto border-zinc-300 dark:border-zinc-800`,
              { hidden: display === `code` },
              { 'max-w-4xl mx-auto': display === `preview` },
              {
                'md:border-l-2 row-start-1 md:row-start-auto border-b-2 md:border-b-0':
                  display === `both`,
              },
            )}
          >
            <Markdown>{code}</Markdown>
          </div>
        </section>
      </main>
    </>
  );
};

export default CreatorView;
