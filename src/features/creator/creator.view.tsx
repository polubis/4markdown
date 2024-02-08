import React from 'react';
import { ThemeToggler } from 'gatsby-plugin-dark-mode';
import Markdown from 'components/markdown';
import {
  BiBookContent,
  BiMoon,
  BiSolidBookContent,
  BiSun,
  BiWindows,
} from 'react-icons/bi';
import { Button } from 'design-system/button';
import {
  creatorStoreActions,
  creatorStoreSelectors,
} from 'store/creator/creator.store';
import c from 'classnames';
import MoreNav from 'components/more-nav';
import { siteMetadataStoreSelectors } from 'store/site-metadata/site-metadata.store';
import { useConfirm } from 'development-kit/use-confirm';
import TemplatesPopover from 'components/templates-popover';
import UserPopover from 'components/user-popover';
import AddDocPopover from 'components/add-doc-popover';
import { useLsSync } from 'development-kit/use-ls-sync';
import { useDocStore } from 'store/doc/doc.store';
import {
  docManagementStoreActions,
  useDocManagementStore,
} from 'store/doc-management/doc-management.store';
import DocBar from 'components/doc-bar';

const ErrorModal = React.lazy(() => import(`../../components/error-modal`));

type DivideMode = 'both' | 'preview' | 'code';

const CreatorView: React.FC = () => {
  useLsSync();

  const meta = siteMetadataStoreSelectors.useReady();
  const docStore = useDocStore();
  const docManagementStore = useDocManagementStore();
  const [divideMode, setDivideMode] = React.useState<DivideMode>(`both`);
  const { code, initialCode } = creatorStoreSelectors.useReady();

  const handleChange = (value: string): void => {
    creatorStoreActions.change(value);
  };

  const clearConfirm = useConfirm(() => handleChange(``));
  const resetConfirm = useConfirm(() => handleChange(initialCode));

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

  return (
    <>
      {docManagementStore.is === `fail` && (
        <React.Suspense>
          <ErrorModal
            heading="Ups, something went wrong"
            message={docManagementStore.error}
            onClose={docManagementStoreActions.idle}
          />
        </React.Suspense>
      )}
      <main className="flex h-full md:flex-col flex-col-reverse">
        <header className="flex items-center overflow-x-auto overflow-y-hidden py-2 pl-4 pr-0 sm:pr-4 bg-zinc-200 dark:bg-gray-950 border-t-2 md:border-b-2 md:border-t-0 border-zinc-300 dark:border-zinc-800 h-[72px]">
          <picture className="w-[32px] h-[32px] shrink-0 sm:flex hidden mr-3">
            <img
              rel="preload"
              src="/favicon-32x32.png"
              alt={meta.appName}
              title={meta.title}
            />
          </picture>
          <nav className="flex gap-2 w-full items-center">
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
            <ThemeToggler>
              {({ theme, toggleTheme }) => (
                <Button
                  i={1}
                  s={2}
                  title="Change theme"
                  className="ml-auto"
                  onClick={() =>
                    toggleTheme(theme === `light` ? `dark` : `light`)
                  }
                >
                  {theme === `light` ? <BiMoon /> : <BiSun />}
                </Button>
              )}
            </ThemeToggler>
            <UserPopover />
            <MoreNav />
            <div className="h-1 w-2 shrink-0 block sm:hidden" />
          </nav>
        </header>
        <DocBar />
        <section
          className={c(
            `grid`,
            docStore.is === `active`
              ? `h-[calc(100svh-72px-50px)]`
              : `h-[calc(100svh-72px)]`,
            {
              'md:grid-cols-2 grid-cols-1 grid-rows-2 md:grid-rows-1':
                divideMode === `both`,
            },
          )}
        >
          <label className="hidden" htmlFor="creator" id="creator">
            Creator
          </label>
          <textarea
            aria-labelledby="creator"
            aria-label="creator"
            spellCheck="false"
            className={c(
              `w-full h-full p-4 border-r-0 resize-none focus:outline-none dark:bg-black bg-white text-lg text-black dark:text-white`,
              { hidden: divideMode === `preview` },
            )}
            value={code}
            onChange={(e) => handleChange(e.target.value)}
          />
          <div
            className={c(
              `p-4 overflow-auto border-zinc-300 dark:border-zinc-800`,
              { hidden: divideMode === `code` },
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
