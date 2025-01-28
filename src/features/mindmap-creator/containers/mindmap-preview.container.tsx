import { Background, Controls, MiniMap, ReactFlow } from '@xyflow/react';
import React from 'react';
import { defaultMindmap } from '../sample-data';

type MindmapPreviewContainerProps = {};

const MindmapPreviewContainer = () => {
  return (
    <ReactFlow
      id="mindmap-preview"
      //   key={mindmap.orientation}
      nodes={defaultMindmap.nodes}
      edges={defaultMindmap.edges}
      //   onNodesChange={mindmapCreatorStoreActions.updateNodes}
      //   onEdgesChange={mindmapCreatorStoreActions.updateEdges}
      //   onConnect={mindmapCreatorStoreActions.connectNodes}
      //   nodeTypes={nodeTypes[mindmap.orientation]}
      //   edgeTypes={edgeTypes}
      //   fitView
      //   minZoom={viewInformation.minZoom}
      //   maxZoom={viewInformation.maxZoom}
    >
      <Controls />
      <Background />
      <MiniMap />
    </ReactFlow>
  );
};

export { MindmapPreviewContainer };
