import React from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { MindmapPreviewContainer } from './containers/mindmap-preview.container';
import { useMindmapCreatorState } from 'store/mindmap-creator';
import { getMindmapAct } from 'acts/get-mindmap.act';
import { TabsNavigationContainer } from './containers/tabs-navigation.container';
import { MindmapModalsProvider } from './providers/mindmap-widgets.provider';
import { Loader } from 'design-system/loader';

import './mindmap-creator.css';

const MindmapCreatorView = () => {
  const mindmapCreator = useMindmapCreatorState();

  React.useEffect(() => {
    // getMindmapAct();
  }, []);

  return (
    <div className="mindmap-creator">
      <aside className="flex justify-center p-4 border-r border-zinc-300 dark:border-zinc-800"></aside>
      <main className="flex flex-col">
        {(mindmapCreator.is === `idle` || mindmapCreator.is === `busy`) && (
          <div className="flex flex-col justify-center items-center h-full">
            <div className="p-4 flex flex-col items-center">
              <h6 className="text-xl text-center">
                Loading mindmap to preview
              </h6>
              <Loader className="mt-6" size="xl" />
            </div>
          </div>
        )}
        {mindmapCreator.is === `ok` && (
          <>
            <TabsNavigationContainer />
            <MindmapPreviewContainer />
          </>
        )}
        {mindmapCreator.is === `fail` && <div>Error</div>}
      </main>
    </div>
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
