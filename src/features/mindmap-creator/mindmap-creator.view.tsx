import React from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { MindmapPreviewContainer } from './containers/mindmap-preview.container';
import { useMindmapCreatorState } from 'store/mindmap-creator';
import { getMindmapAct } from 'acts/get-mindmap.act';
import { TabsNavigationContainer } from './containers/tabs-navigation.container';

import './mindmap-creator.css';

const MindmapCreatorView = () => {
  const mindmapCreator = useMindmapCreatorState();

  React.useEffect(() => {
    getMindmapAct();
  }, []);

  return (
    <div className="mindmap-creator">
      <aside className="flex justify-center p-4 border-r border-zinc-300 dark:border-zinc-800"></aside>
      <main className="flex flex-col">
        {(mindmapCreator.is === `idle` || mindmapCreator.is === `busy`) && (
          <div> Loading...</div>
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
    <MindmapCreatorView />
  </ReactFlowProvider>
);

export { ConnectedMindmapCreatorView as MindmapCreatorView };
