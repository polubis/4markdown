import React, { useEffect } from 'react';
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
import CopyButtons from './copy-buttons';
import c from 'classnames';
import MoreNav from 'components/more-nav';
import { siteMetadatStoreSelectors } from 'store/site-metadata/site-metadata.store';

const CreatorView: React.FC = () => {
  const meta = siteMetadatStoreSelectors.useReady();
  const { code, initialCode, divideMode } = creatorStoreSelectors.useReady();

  useEffect(() => creatorStoreActions.sync(), []);

  useEffect(() => {
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

  return (
    <main className="flex h-full md:flex-col flex-col-reverse">
      <header className="flex overflow-x-auto overflow-y-hidden items-center py-2 px-4 bg-zinc-200 dark:bg-gray-950 border-b-2 border-zinc-300 dark:border-zinc-800 h-[72px]">
        <img
          className="shrink-0 lg:flex hidden"
          src="/favicon-32x32.png"
          alt={meta.appName}
          title={meta.title}
        />
        <nav className="flex w-full items-center">
          <div className="bg-zinc-300 dark:bg-zinc-800 h-8 w-0.5 mx-4 lg:block hidden shrink-0" />
          <CopyButtons.Headings />
          <CopyButtons.Link />
          <CopyButtons.Image />
          <CopyButtons.Code />
          <CopyButtons.Table />
          <div className="bg-zinc-300 dark:bg-zinc-800 h-8 w-0.5 mx-4 shrink-0" />
          <Button
            i={2}
            className="lg:flex hidden"
            rfull
            disabled={code === ``}
            title="Clear Content"
            onClick={creatorStoreActions.clear}
          >
            Clear
          </Button>
          <Button
            i={2}
            className="ml-2 mr-2 lg:flex hidden"
            rfull
            disabled={code === initialCode}
            title="Reset Content"
            onClick={creatorStoreActions.reset}
          >
            Reset
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
            href=""
            target="_blank"
            className="ml-2 md:block hidden"
            rel="noopener"
            title="Open in separate window"
          >
            <Button i={2} rfull>
              <BiWindows className="text-2xl" />
            </Button>
          </a>
          <div className="bg-zinc-300 dark:bg-zinc-800 h-8 w-0.5 mx-4 shrink-0" />
          <ThemeToggler>
            {({ theme, toggleTheme }) => (
              <Button
                className="ml-2"
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
          <div className="h-1 w-4 shrink-0 block sm:hidden" />
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
          onChange={(e) => creatorStoreActions.change(e.target.value)}
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
