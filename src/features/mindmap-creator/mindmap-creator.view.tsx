import React, { type MouseEventHandler } from 'react';
import { Link } from 'gatsby';
import { BiBug, BiDownload, BiPlus } from 'react-icons/bi';
import { Button } from 'design-system/button';
import UserPopover from 'components/user-popover';
import MoreNav from 'components/more-nav';
import { MindmapCreatorContainer } from './containers/mindmap-creator.container';
import { useAuthStore } from 'store/auth/auth.store';
import { logIn } from 'actions/log-in.action';
import { meta } from '../../../meta';
import { useMindmapCreatorState } from 'store/mindmap-creator';
import {
  clearMindmapAction,
  downloadMindmapAction,
  openMindmapFormAction,
  resetMindmapAction,
} from 'store/mindmap-creator/actions';
import { MindmapFormModalContainer } from './containers/mindmap-form-modal.container';
import { SubNavContainer } from './containers/sub-nav.container';
import { useConfirm } from 'development-kit/use-confirm';
import { getYourMindmapsAct } from 'acts/get-your-mindmaps.act';

import '../../style/mindmaps.css';

const ADD_MINDMAP_KEY = `add-mindmap`;

const isMindmapCreationActive = (): boolean =>
  sessionStorage.getItem(ADD_MINDMAP_KEY) === `1`;

const triggerMindmapCreation = (): void => {
  sessionStorage.setItem(ADD_MINDMAP_KEY, `1`);
};

const resetMindmapCreation = (): void => {
  sessionStorage.removeItem(ADD_MINDMAP_KEY);
};

const AddNewMindmapContainer = () => {
  const authStore = useAuthStore();
  const { mindmapForm } = useMindmapCreatorState();

  const startMindmapCreation: MouseEventHandler<HTMLButtonElement> = () => {
    if (authStore.is === `authorized`) {
      openMindmapFormAction();
      return;
    }

    triggerMindmapCreation();
    logIn();
  };

  React.useEffect(() => {
    if (
      authStore.is === `authorized` &&
      mindmapForm.is === `closed` &&
      isMindmapCreationActive()
    ) {
      resetMindmapCreation();
      openMindmapFormAction();
    }
  }, [authStore.is, mindmapForm.is]);

  return (
    <>
      <Button
        i={1}
        disabled={authStore.is === `idle`}
        s={2}
        title="Create new mindmap"
        onClick={startMindmapCreation}
      >
        <BiPlus />
      </Button>
      {(mindmapForm.is === `active` || mindmapForm.is === `edition`) && (
        <MindmapFormModalContainer />
      )}
    </>
  );
};

const MindmapCreatorView = () => {
  const authStore = useAuthStore();
  const clearConfirm = useConfirm(clearMindmapAction);
  const resetConfirm = useConfirm(resetMindmapAction);

  React.useEffect(() => {
    authStore.is === `authorized` && getYourMindmapsAct();
  }, [authStore]);

  return (
    <>
      <main className="md:mt-[122px] md:mb-0 mb-[122px] h-[calc(100svh-50px-72px)]">
        <MindmapCreatorContainer />
      </main>
      <header className="flex flex-col-reverse md:flex-col fixed bottom-0 md:top-0 md:bottom-[unset] left-0 right-0 bg-zinc-50 dark:bg-zinc-950">
        <div className="h-[72px] px-4 border-t md:border-b md:border-t-0 border-zinc-300 dark:border-zinc-800 flex justify-between gap-2">
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
            <Button
              i={1}
              s={2}
              title="Download mindmap as JSON file"
              onClick={downloadMindmapAction}
            >
              <BiDownload />
            </Button>
            <Button
              i={1}
              s={2}
              auto
              className="md:flex hidden"
              title="Clear mindmap"
              onClick={clearConfirm.confirm}
            >
              {clearConfirm.isOn ? `Sure?` : `Clear`}
            </Button>
            <Button
              i={1}
              s={2}
              auto
              className="md:flex hidden"
              title="Reset mindmap"
              onClick={resetConfirm.confirm}
            >
              {resetConfirm.isOn ? `Sure?` : `Reset`}
            </Button>
            <Button
              i={1}
              s={2}
              auto
              className="bg-gradient-to-r from-sky-200 via-pink-200 to-gray-300 dark:from-sky-800 dark:via-pink-800 dark:to-gray-900 animate-gradient-move bg-[length:200%_200%]"
              title="Report a bug"
            >
              <span className="hidden md:inline mr-1">
                It&apos;s A Beta! Report A Bug
              </span>
              <BiBug />
            </Button>
          </nav>
          <div />
          <nav className="flex items-center gap-2">
            <UserPopover />
            <MoreNav />
          </nav>
        </div>
        <nav className="h-[50px] px-4 border-t md:border-b md:border-t-0 border-zinc-300 dark:border-zinc-800 flex items-center">
          <SubNavContainer />
        </nav>
      </header>
    </>
  );
};

export { MindmapCreatorView };
