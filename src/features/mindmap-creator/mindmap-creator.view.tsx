import { ReactFlowProvider } from '@xyflow/react';
import React from 'react';
import { MindmapPreviewContainer } from './containers/mindmap-preview.container';
import { Button } from 'design-system/button';
import { BiPlus } from 'react-icons/bi';

import './mindmap-creator.css';

const MindmapCreatorView = () => {
  return (
    <div className="mindmap-creator">
      <aside>
        <Button i={1} s={2}>
          <BiPlus />
        </Button>
      </aside>
      <main>
        <MindmapPreviewContainer />
      </main>
    </div>
  );
};

MindmapCreatorView.Provider = ReactFlowProvider;

export { MindmapCreatorView };
