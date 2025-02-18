import { Background, Controls, MiniMap, ReactFlow } from '@xyflow/react';
import React from 'react';
import { useMindmapCreatorStore } from '../store';

const MindmapCreatorContainer = () => {
  const { orientation, nodes, edges } = useMindmapCreatorStore();

  return (
    <ReactFlow
      key={orientation}
      nodes={nodes}
      edges={edges}
      //   onNodesChange={updateNodesAction}
      //   onEdgesChange={updateEdgesAction}
      //   onConnect={connectNodesAction}
      //   nodeTypes={nodeTypes[activeMindmap.orientation] as NodeTypes}
      //   edgeTypes={edgeTypes}
      fitView
    >
      <Controls />
      <Background />
      <MiniMap />
    </ReactFlow>
  );
};

export { MindmapCreatorContainer };
