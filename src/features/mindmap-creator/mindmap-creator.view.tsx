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
import { reloadYourMindmapsAct } from 'acts/reload-your-mindmaps.act';
import { BiPlus, BiPlusCircle } from 'react-icons/bi';
import { navigate } from 'gatsby';
import { meta } from '../../../meta';
import { yourMindmapsReadySelector } from 'store/your-mindmaps/selectors';
import { AppNavigation } from 'components/app-navigation';

import './mindmap-creator.css';
import { useAuthStore } from 'store/auth/auth.store';

const MindmapCreatorView = () => {
  const mindmapCreator = useMindmapCreatorState();
  const { creation } = useMindmapModalsContext();
  const yourMindmaps = useYourMindmapsState(yourMindmapsReadySelector);
  console.log(yourMindmaps);
  if (mindmapCreator.is === `unset`) {
    if (yourMindmaps.mindmaps.length === 0) {
      return (
        <section className="flex flex-col justify-center items-center h-full">
          <div className="p-4 flex flex-col items-center max-w-[420px]">
            <h6 className="text-xl text-center">You have 0 mindmaps</h6>
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
        <section className="flex flex-col justify-center items-center h-full">
          LiSt of mindmaps to select
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
      {creation.isOn && <CreateNodeModalContainer />}
    </>
  );
};

const ConnectedMindmapCreatorView = () => {
  const authStore = useAuthStore();
  const yourMindmaps = useYourMindmapsState();

  React.useEffect(() => {
    if (authStore.is === `authorized`) getYourMindmapsAct();
  }, [authStore]);

  return (
    <>
      <AppNavigation>
        <Button
          i={2}
          s={2}
          auto
          onClick={() => navigate(meta.routes.mindmap.new)}
        >
          <BiPlus /> New Mindmap
        </Button>
      </AppNavigation>
      <main className="mindmap-creator flex flex-col relative">
        {yourMindmaps.is === `busy` && (
          <section className="flex flex-col justify-center items-center h-full">
            <div className="p-4 flex flex-col items-center">
              <h6 className="text-xl text-center">Loading your mindmaps</h6>
              <Loader className="mt-6" size="xl" />
            </div>
          </section>
        )}
        {yourMindmaps.is === `ok` && (
          <ReactFlowProvider>
            <MindmapModalsProvider>
              <MindmapCreatorView />
            </MindmapModalsProvider>
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
                onClick={reloadYourMindmapsAct}
              >
                Try Agian
              </Button>
            </div>
          </section>
        )}
      </main>
    </>
  );
};

export { ConnectedMindmapCreatorView as MindmapCreatorView };
