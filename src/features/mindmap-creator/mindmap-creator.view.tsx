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
import { navigate } from 'gatsby';
import { meta } from '../../../meta';
import { Button } from 'design-system/button';
import { EmptyNodesMindmapContainer } from './containers/empty-nodes-mindmap.container';
import { CreateNodeModalContainer } from './containers/create-node-modal.container';
import { getYourMindmapsAct } from 'acts/get-your-mindmaps.act';
import { useYourMindmapsState } from 'store/your-mindmaps';

import './mindmap-creator.css';

const MindmapCreatorView = () => {
  const mindmapCreator = useMindmapCreatorState();
  const { creation } = useMindmapModalsContext();

  if (mindmapCreator.is === `unset`) {
    return (
      <section className="flex flex-col justify-center items-center h-full">
        TODO ADD LIST TO SELCT FROM OR CREAT ENEW ITEM
      </section>
    );
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
  const yourMindmaps = useYourMindmapsState();

  React.useEffect(() => {
    getYourMindmapsAct();
  }, []);

  return (
    <div className="mindmap-creator">
      <aside className="flex justify-center p-4 border-r border-zinc-300 dark:border-zinc-800"></aside>
      <main className="flex flex-col relative">
        {(yourMindmaps.is === `idle` || yourMindmaps.is === `busy`) && (
          <section className="flex flex-col justify-center items-center h-full">
            <div className="p-4 flex flex-col items-center">
              <h6 className="text-xl text-center">
                Loading mindmap to preview
              </h6>
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
                onClick={() => navigate(meta.routes.mindmap.new)}
              >
                Try Agian
              </Button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export { ConnectedMindmapCreatorView as MindmapCreatorView };
