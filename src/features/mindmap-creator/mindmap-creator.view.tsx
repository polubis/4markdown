import React from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { MindmapPreviewContainer } from './containers/mindmap-preview.container';
import { useMindmapCreatorState } from 'store/mindmap-creator';
import { TabsNavigationContainer } from './containers/tabs-navigation.container';
import {
  MindmapModalsProvider,
  useMindmapModalsContext,
} from './providers/mindmap-widgets.provider';
import { Loader } from 'design-system/loader';
import { Button } from 'design-system/button';
import { EmptyNodesMindmapContainer } from './containers/empty-nodes-mindmap.container';
import { CreateNodeModalContainer } from './containers/create-node-modal.container';
import { getYourMindmapsAct } from 'acts/get-your-mindmaps.act';
import { useYourMindmapsState } from 'store/your-mindmaps';
import {
  BiCategory,
  BiLowVision,
  BiPlus,
  BiPlusCircle,
  BiShow,
  BiWorld,
} from 'react-icons/bi';
import { navigate } from 'gatsby';
import { meta } from '../../../meta';
import { yourMindmapsReadySelector } from 'store/your-mindmaps/selectors';
import { AppNavigation } from 'components/app-navigation';
import { useAuthStore } from 'store/auth/auth.store';
import { formatDistance } from 'date-fns';
import { initializeMindmapAction } from 'store/mindmap-creator/actions';
import { RemoveNodesModalContainer } from './containers/remove-nodes-modal.container';
import { MindmapsListModalContainer } from './containers/mindmaps-list-modal.container';

import './mindmap-creator.css';
import { restartMindmapCreatorAct } from 'acts/restart-mindmap-creator.act';

const MindmapModals = () => {
  const { nodeCreation, nodesRemovalConfirm, mindmapsListModal } =
    useMindmapModalsContext();

  return (
    <>
      {nodeCreation.isOn && <CreateNodeModalContainer />}
      {nodesRemovalConfirm.isOn && <RemoveNodesModalContainer />}
      {mindmapsListModal.isOn && <MindmapsListModalContainer />}
    </>
  );
};

const MindmapCreatorView = () => {
  const mindmapCreator = useMindmapCreatorState();
  const yourMindmaps = useYourMindmapsState(yourMindmapsReadySelector);

  if (mindmapCreator.is === `unset`) {
    if (yourMindmaps.mindmaps.length === 0) {
      return (
        <section className="flex flex-col justify-center items-center h-full">
          <div className="p-4 flex flex-col items-center max-w-[420px]">
            <h6 className="text-xl text-center">You Have 0 Mindmaps</h6>
            <p className="text-center mt-1 mb-2">
              Don&apos;t worry, click the button below to create your first one.
            </p>
            <Button
              title="Create first mindmap"
              className="mt-4"
              auto
              s={2}
              i={2}
              onClick={() => navigate(meta.routes.mindmap.new)}
            >
              Create First Mindmap
              <BiPlusCircle />
            </Button>
          </div>
        </section>
      );
    } else {
      return (
        <section className="flex flex-col justify-center items-center h-full p-4 overflow-y-auto">
          <h1 className="text-xl mb-6">Your Mindmaps</h1>
          <ul className="flex justify-center flex-wrap gap-3">
            {yourMindmaps.mindmaps.map((mindmap, index) => (
              <li
                className="animate-fade-in opacity-0 flex flex-col w-[280px] cursor-pointer border-2 rounded-lg px-4 py-3 bg-zinc-200 dark:hover:bg-gray-900 dark:bg-gray-950 hover:bg-zinc-300 border-zinc-300 dark:border-zinc-800"
                title={mindmap.name}
                key={mindmap.id}
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => initializeMindmapAction(mindmap)}
              >
                <div className="flex justify-between mb-0.5">
                  <span className="text-sm capitalize mr-6">
                    Edited{` `}
                    {formatDistance(new Date(), mindmap.mdate, {
                      addSuffix: true,
                    })}
                    {` `}
                    ago
                  </span>
                  {mindmap.visibility === `private` && (
                    <BiLowVision size="20" title="This document is private" />
                  )}
                  {mindmap.visibility === `public` && (
                    <BiShow size="20" title="This document is public" />
                  )}
                  {mindmap.visibility === `permanent` && (
                    <BiWorld size="20" title="This document is permanent" />
                  )}
                </div>
                <strong>{mindmap.name}</strong>
              </li>
            ))}
          </ul>
        </section>
      );
    }
  }

  return (
    <>
      <TabsNavigationContainer />
      {mindmapCreator.activeMindmap.nodes.length === 0 ? (
        <EmptyNodesMindmapContainer />
      ) : (
        <MindmapPreviewContainer />
      )}
    </>
  );
};

const ConnectedMindmapCreatorView = () => {
  const yourMindmaps = useYourMindmapsState();
  const { mindmapsListModal } = useMindmapModalsContext();

  React.useEffect(() => {
    getYourMindmapsAct();
  }, []);

  return (
    <>
      <AppNavigation>
        <Button i={1} s={2} onClick={() => navigate(meta.routes.mindmap.new)}>
          <BiPlus />
        </Button>
        <Button i={1} s={2} onClick={mindmapsListModal.on}>
          <BiCategory />
        </Button>
        <button className="py-2 px-4 rounded-md border dark:border-gray-300 dark:text-gray-300 text-gray-800 border-gray-800">
          It&apos;s Beta :X (Report Bug If Any, Please)
        </button>
      </AppNavigation>
      <main className="mindmap-creator flex flex-col relative">
        {(yourMindmaps.is === `idle` || yourMindmaps.is === `busy`) && (
          <section className="flex flex-col justify-center items-center h-full">
            <div className="p-4 flex flex-col items-center">
              <h6 className="text-xl text-center">Loading Your Mindmaps</h6>
              <Loader className="mt-6" size="xl" />
            </div>
          </section>
        )}
        {yourMindmaps.is === `ok` && (
          <ReactFlowProvider>
            <MindmapCreatorView />
          </ReactFlowProvider>
        )}
        {yourMindmaps.is === `fail` && (
          <section className="flex flex-col justify-center items-center h-full">
            <div className="p-4 flex flex-col items-center max-w-[420px]">
              <h6 className="text-xl text-center">
                {yourMindmaps.error.message}
              </h6>
              <Button
                title="Load your mindmaps again"
                className="mt-4"
                auto
                s={2}
                i={2}
                onClick={restartMindmapCreatorAct}
              >
                Try Agian
              </Button>
            </div>
          </section>
        )}
      </main>
      <MindmapModals />
    </>
  );
};

const ProtectedMindmapCreatorView = () => {
  const authStore = useAuthStore();

  return authStore.is === `authorized` ? (
    <MindmapModalsProvider>
      <ConnectedMindmapCreatorView />
    </MindmapModalsProvider>
  ) : (
    <>
      <AppNavigation>
        <div>Sign In to create mindmaps</div>
      </AppNavigation>
      <main className="bg-red-500">Sign in to create mindmaps!</main>
    </>
  );
};

export { ProtectedMindmapCreatorView as MindmapCreatorView };
