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
  CREATOR_STORE_LS_KEY,
  creatorStoreActions,
  creatorStoreSelectors,
} from 'store/creator/creator.store';
import c from 'classnames';
import MoreNav from 'components/more-nav';
import { siteMetadatStoreSelectors } from 'store/site-metadata/site-metadata.store';
import { useConfirm } from 'development-kit/use-confirm';
import AddPopover from 'components/add-popover';

const CreatorView: React.FC = () => {
  const meta = siteMetadatStoreSelectors.useReady();
  const { code, initialCode, divideMode } = creatorStoreSelectors.useReady();

  React.useEffect(() => creatorStoreActions.sync(), []);

  React.useEffect(() => {
    const listener = (event: StorageEvent) => {
      if (event.key === CREATOR_STORE_LS_KEY && event.newValue !== null) {
        creatorStoreActions.sync();
      }
    };

    window.addEventListener(`storage`, listener);

    return () => {
      window.removeEventListener(`storage`, listener);
    };
  }, []);

  const handleChange = (value: string): void => {
    creatorStoreActions.change(value);
  };

  const getEditorState = (): string => {
    return `https://4markdown.com`;
  };

  const handleLinkClick = (): void => {
    const editorStateLink = getEditorState();
    window.open(
      editorStateLink,
      `_blank`,
      `width=${screen.availWidth},height=${screen.availHeight}`,
    );
  };

  const clearConfirm = useConfirm(() => handleChange(``));
  const resetConfirm = useConfirm(() => handleChange(initialCode));

  return (
    <main className="flex h-full md:flex-col flex-col-reverse">
      <header className="flex items-center py-2 px-4 bg-zinc-200 dark:bg-gray-950 border-b-2 border-zinc-300 dark:border-zinc-800 h-[72px]">
        <picture className="w-[32px] h-[32px] shrink-0 lg:flex hidden">
          <img
            rel="preload"
            src="/favicon-32x32.png"
            alt={meta.appName}
            title={meta.title}
          />
        </picture>
        <nav className="flex w-full items-center">
          <div className="bg-zinc-300 dark:bg-zinc-800 h-8 w-0.5 mx-3 lg:block hidden shrink-0" />
          <AddPopover />
          <div className="bg-zinc-300 dark:bg-zinc-800 h-8 w-0.5 mx-3 shrink-0" />
          <Button
            i={2}
            className="md:flex hidden"
            rfull
            disabled={code === ``}
            title="Clear Content"
            onClick={clearConfirm.confirm}
          >
            {clearConfirm.opened ? `Sure?` : `Clear`}
          </Button>
          <Button
            i={2}
            className="ml-2 mr-2 md:flex hidden"
            rfull
            disabled={code === initialCode}
            title="Reset Content"
            onClick={resetConfirm.confirm}
          >
            {resetConfirm.opened ? `Sure?` : `Reset`}
          </Button>
          <Button
            i={2}
            className="ml-auto"
            rfull
            title="Change view display"
            onClick={creatorStoreActions.divide}
          >
            {divideMode === `both` && (
              <BiBookContent className="text-2xl rotate-90 md:rotate-0" />
            )}
            {divideMode === `code` && (
              <BiSolidBookContent className="text-2xl rotate-180" />
            )}
            {divideMode === `preview` && (
              <BiSolidBookContent className="text-2xl" />
            )}
          </Button>
          <a
            href={getEditorState()}
            target="_blank"
            className="ml-2 md:block hidden"
            rel="noopener noreferrer"
            title="Open in separate window"
            onClick={handleLinkClick}
          >
            <Button i={2} rfull>
              <BiWindows className="text-2xl" />
            </Button>
          </a>
          <div className="bg-zinc-300 dark:bg-zinc-800 h-8 w-0.5 mx-3 shrink-0" />
          <ThemeToggler>
            {({ theme, toggleTheme }) => (
              <Button
                i={2}
                title="Change theme"
                rfull
                onClick={() => toggleTheme(theme === `dark` ? `light` : `dark`)}
              >
                {theme === `light` ? (
                  <BiMoon className="text-2xl" />
                ) : (
                  <BiSun className="text-2xl" />
                )}
              </Button>
            )}
          </ThemeToggler>
          <MoreNav />
        </nav>
      </header>
      <section
        className={c(`grid h-[calc(100svh-72px)]`, {
          'md:grid-cols-2 grid-cols-1 grid-rows-2 md:grid-rows-1':
            divideMode === `both`,
        })}
      >
        <label className="hidden" htmlFor="creator" id="creator">
          Creator
        </label>
        <textarea
          aria-labelledby="creator"
          aria-label="creator"
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
  );
};

export default CreatorView;
