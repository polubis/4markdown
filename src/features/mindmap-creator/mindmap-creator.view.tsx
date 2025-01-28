import './mindmap-style.css';
import '@xyflow/react/dist/base.css';

import { ReactFlowProvider } from '@xyflow/react';
import React from 'react';
import { MindmapPreviewContainer } from './containers/mindmap-preview.container';
import { Button } from 'design-system/button';
import { BiPlus } from 'react-icons/bi';

const MindmapCreatorView = () => {
  return (
    <div className="mindmap-creator">
      <aside className="flex justify-center p-4 border-r border-zinc-300 dark:border-zinc-800">
        <Button i={1} s={1}>
          <BiPlus size={18} />
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
