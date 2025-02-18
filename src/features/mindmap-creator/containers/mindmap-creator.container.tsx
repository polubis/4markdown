import { Background, Controls, MiniMap, ReactFlow } from '@xyflow/react';
import React from 'react';
import { useMindmapCreatorStore } from '../store';
import { usePortal } from 'development-kit/use-portal';
import { Button } from 'design-system/button';
import { BiAddToQueue, BiHorizontalRight, BiTrash } from 'react-icons/bi';
import c from 'classnames';

const ToolboxContainer = () => {
  const { render } = usePortal();
  const { orientation } = useMindmapCreatorStore();

  return render(
    <nav className="fixed flex justify-center space-x-2 py-2 max-w-sm mx-auto bottom-[126px] right-4 md:right-0 md:left-0 md:bottom-0">
      <Button i={2} s={1} title="Center mindmap">
        <BiHorizontalRight
          className={c({
            'rotate-90': orientation === `y`,
          })}
        />
      </Button>

      <Button
        i={2}
        // disabled={!hasSelectedNode}
        s={1}
        title="Remove selected nodes"
        // onClick={nodesRemovalConfirm.on}
      >
        <BiTrash />
      </Button>
      <Button
        i={2}
        s={1}
        // onClick={nodeCreation.on}
        title="Add new mindmap node"
      >
        <BiAddToQueue />
      </Button>
    </nav>,
  );
};

const MindmapCreatorContainer = () => {
  const { orientation, nodes, edges } = useMindmapCreatorStore();

  return (
    <>
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
        <MiniMap className="hidden md:block" />
      </ReactFlow>
      <ToolboxContainer />
    </>
  );
};

export { MindmapCreatorContainer };
