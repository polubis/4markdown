import React, { type MouseEventHandler } from 'react';
import c from 'classnames';
import { Link } from 'gatsby';
import { BiPlus } from 'react-icons/bi';
import { Button } from 'design-system/button';
import UserPopover from 'components/user-popover';
import MoreNav from 'components/more-nav';
import { MindmapCreatorContainer } from './containers/mindmap-creator.container';
import { useAuthStore } from 'store/auth/auth.store';
import { logIn } from 'actions/log-in.action';
import { meta } from '../../../meta';
import { openMindmapFormAction } from './store/actions';
import { NewMindmapModalContainer } from './containers/new-mindmap-modal.container';
import { useMindmapCreatorState } from './store';

import './mindmap-creator.css';

const AddNewMindmapContainer = () => {
  const authStore = useAuthStore();
  const { mindmapForm } = useMindmapCreatorState();

  const startMindmapCreation: MouseEventHandler<HTMLButtonElement> = () => {
    if (authStore.is === `idle`) return;

    if (authStore.is === `authorized`) {
      openMindmapFormAction();
      return;
    }

    logIn();
  };

  return (
    <>
      <Button
        i={1}
        s={2}
        title="Create new mindmap"
        onClick={startMindmapCreation}
      >
        <BiPlus />
      </Button>
      {mindmapForm.is === `active` && <NewMindmapModalContainer />}
    </>
  );
};

const MindmapCreatorView = () => {
  return (
    <>
      <main className="md:mt-[122px] md:mb-0 mb-[122px] h-[calc(100svh-50px-72px)]">
        <MindmapCreatorContainer />
      </main>
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
            <AddNewMindmapContainer />
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
          {/* <DocBarContainer /> */}
        </nav>
      </header>
    </>
  );
};

export { MindmapCreatorView };
