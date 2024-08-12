import React from 'react';
import Markdown from 'components/markdown';
import { BiBookContent, BiSolidBookContent, BiWindows } from 'react-icons/bi';
import { Button } from 'design-system/button';
import {
  creatorStoreActions,
  creatorStoreSelectors,
} from 'store/creator/creator.store';
import c from 'classnames';
import { useConfirm } from 'development-kit/use-confirm';
import TemplatesPopover from './components/templates-popover';
import AddDocPopover from 'components/add-doc-popover';
import { useLsSync } from 'development-kit/use-ls-sync';
import { useDocManagementStore } from 'store/doc-management/doc-management.store';
import { DocBarContainer } from './containers/doc-bar.container';
import { ImageUploaderContainer } from './containers/image-uploader.container';
import { CreatorNavigation } from './components/creator-navigation';

const CreatorErrorModalContainer = React.lazy(
  () => import(`./containers/creator-error-modal.container`),
);

type DivideMode = 'both' | 'preview' | 'code';

const scrollToPreview = (input: HTMLTextAreaElement): number => {
  const cursor = input.value
    .substring(0, input.selectionStart)
    .split(`\n`).length;
  const lines = input.value.split(`\n`);
  const content = lines[cursor - 1].trim();

  const elements = Array.from(
    document.querySelectorAll(`.markdown > div > *:is(h1,h2,h3,h4,h5,h6)`),
  );

  for (const element of elements) {
    if (element.textContent && content.includes(element.textContent.trim())) {
      element.scrollIntoView({ behavior: `smooth` });
      break;
    }
  }

  return lines.length;
};

const CreatorView: React.FC = () => {
  useLsSync();

  const docManagementStore = useDocManagementStore();
  const [divideMode, setDivideMode] = React.useState<DivideMode>(`both`);
  const { code, initialCode } = creatorStoreSelectors.useReady();
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>();
  const creatorRef = React.useRef<HTMLTextAreaElement>(null);

  const clearConfirm = useConfirm(() => creatorStoreActions.change(``));
  const resetConfirm = useConfirm(() =>
    creatorStoreActions.change(initialCode),
  );

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
    if (e.key !== `Tab`) {
      return;
    }

    e.preventDefault();

    const target = e.target as HTMLTextAreaElement;
    const start = target.selectionStart;
    const end = target.selectionEnd;

    const newValue =
      code.substring(0, start) + ` ` + ` ` + ` ` + ` ` + code.substring(end);

    creatorStoreActions.change(newValue);

    target.selectionStart = target.selectionEnd = start + 1;
  };

  const changeCode: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    const timeout = timeoutRef.current;

    timeout && clearTimeout(timeout);

    timeoutRef.current = setTimeout(() => {
      creatorStoreActions.change(e.target.value);
    }, 750);
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
      <main className="flex h-full md:flex-col flex-col-reverse">
        <CreatorNavigation>
          <AddDocPopover />
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
            onClick={() => {
              window.open(
                window.location.href,
                `_blank`,
                `width=${screen.availWidth},height=${screen.availHeight}`,
              );
            }}
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
          <label className="hidden" htmlFor="creator" id="creator">
            Creator
          </label>
          <textarea
            ref={creatorRef}
            aria-labelledby="creator"
            aria-label="creator"
            spellCheck="false"
            className={c(
              `w-full h-full p-4 border-r-0 resize-none focus:outline-none dark:bg-black bg-white text-lg text-black dark:text-white`,
              { hidden: divideMode === `preview` },
            )}
            onChange={changeCode}
            onKeyDown={maintainTabs}
            onClick={(e) => {
              scrollToPreview(e.target as HTMLTextAreaElement);
            }}
          />
          <div
            className={c(
              `p-4 overflow-auto w-full h-full border-zinc-300 dark:border-zinc-800`,
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
      </main>
    </>
  );
};

export default CreatorView;
