import React from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { MindmapPreviewContainer } from './containers/mindmap-preview.container';
import { useMindmapCreatorState } from 'store/mindmap-creator';
import { getMindmapAct } from 'acts/get-mindmap.act';
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

import './mindmap-creator.css';
import { CreateNodeModalContainer } from './containers/create-node-modal.container';

const MindmapCreatorView = () => {
  const mindmapCreator = useMindmapCreatorState();
  const { creation } = useMindmapModalsContext();

  React.useEffect(() => {
    getMindmapAct();
  }, []);

  return (
    <>
      <div className="mindmap-creator">
        <aside className="flex justify-center p-4 border-r border-zinc-300 dark:border-zinc-800"></aside>
        <main className="flex flex-col relative">
          {(mindmapCreator.is === `idle` || mindmapCreator.is === `busy`) && (
            <section className="flex flex-col justify-center items-center h-full">
              <div className="p-4 flex flex-col items-center">
                <h6 className="text-xl text-center">
                  Loading mindmap to preview
                </h6>
                <Loader className="mt-6" size="xl" />
              </div>
            </section>
          )}
          {mindmapCreator.is === `ok` && (
            <>
              <TabsNavigationContainer />
              {mindmapCreator.activeMindmap.nodes.length === 0 ? (
                <EmptyNodesMindmapContainer />
              ) : (
                <MindmapPreviewContainer />
              )}
            </>
          )}
          {mindmapCreator.is === `fail` && (
            <section className="flex flex-col justify-center items-center h-full">
              <div className="p-4 flex flex-col items-center max-w-[420px]">
                <h6 className="text-xl text-center">
                  {mindmapCreator.error.message}
                </h6>
                <Button
                  title="Create new mindmap"
                  className="mt-4"
                  auto
                  s={2}
                  i={2}
                  onClick={() => navigate(meta.routes.mindmap.new)}
                >
                  Create New Mindmap
                </Button>
              </div>
            </section>
          )}
        </main>
      </div>
      {creation.isOn && <CreateNodeModalContainer />}
    </>
  );
};

const ConnectedMindmapCreatorView = () => (
  <ReactFlowProvider>
    <MindmapModalsProvider>
      <MindmapCreatorView />
    </MindmapModalsProvider>
  </ReactFlowProvider>
);

export { ConnectedMindmapCreatorView as MindmapCreatorView };
