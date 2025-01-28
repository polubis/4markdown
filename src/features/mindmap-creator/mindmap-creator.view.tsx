import React from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { MindmapPreviewContainer } from './containers/mindmap-preview.container';
import { Button } from 'design-system/button';
import { BiPlus } from 'react-icons/bi';
import { useMindmapCreatorState } from 'store/mindmap-creator';
import { getMindmapAct } from 'acts/get-mindmap.act';

import './mindmap-creator.css';

const MindmapCreatorView = () => {
  const { is } = useMindmapCreatorState();

  React.useEffect(() => {
    getMindmapAct();
  }, []);

  return (
    <div className="mindmap-creator">
      <aside>
        <Button i={1} s={2}>
          <BiPlus />
        </Button>
      </aside>
      <main>
        {(is === `idle` || is === `busy`) && <div> Loading...</div>}
        {is === `ok` && <MindmapPreviewContainer />}
        {is === `fail` && <div>Error</div>}
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
