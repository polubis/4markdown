import type { EdgeProps, EdgeTypes, NodeProps, NodeTypes } from '@xyflow/react';
import { Background, Controls, MiniMap, ReactFlow } from '@xyflow/react';
import React, { type ComponentType } from 'react';
import { useMindmapCreatorStore } from '../store';
import { usePortal } from 'development-kit/use-portal';
import { Button } from 'design-system/button';
import { BiAddToQueue, BiHorizontalRight, BiTrash } from 'react-icons/bi';
import c from 'classnames';
import { openNodeFormAction } from '../store/action';
import type {
  MindmapCreatorEdge,
  MindmapCreatorNode,
  MindmapCreatorStore,
} from '../store/models';
import {
  ExternalNodeTileX,
  ExternalNodeTileY,
} from '../components/external-node-tile';
import {
  EmbeddedNodeTileContainerX,
  EmbeddedNodeTileContainerY,
} from './embedded-node-tile.container';
import { SolidEdgeContainer } from './solid-edge.container';

const NewNodeModalContainer = React.lazy(() =>
  import(`./new-node-modal.container`).then((m) => ({
    default: m.NewNodeModalContainer,
  })),
);

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
        onClick={openNodeFormAction}
        title="Add new mindmap node"
      >
        <BiAddToQueue />
      </Button>
    </nav>,
  );
};

type MindmapNodeTypes = {
  [Orientation in MindmapCreatorStore['orientation']]: {
    [Type in MindmapCreatorNode['type']]: ComponentType<
      NodeProps<Extract<MindmapCreatorNode, { type: Type }>>
    >;
  };
};

type MindmapEdgeTypes = {
  [Type in MindmapCreatorEdge['type']]: ComponentType<
    EdgeProps<Extract<MindmapCreatorEdge, { type: Type }>>
  >;
};

const mindmapNodeTypes: MindmapNodeTypes = {
  x: {
    external: ExternalNodeTileX,
    embedded: EmbeddedNodeTileContainerX,
  },
  y: {
    external: ExternalNodeTileY,
    embedded: EmbeddedNodeTileContainerY,
  },
};

const edgeTypes: MindmapEdgeTypes = {
  solid: SolidEdgeContainer,
};

const MindmapCreatorContainer = () => {
  const { orientation, nodes, edges, nodeForm } = useMindmapCreatorStore();

  return (
    <>
      <ReactFlow
        key={orientation}
        nodes={nodes}
        edges={edges}
        //   onNodesChange={updateNodesAction}
        //   onEdgesChange={updateEdgesAction}
        //   onConnect={connectNodesAction}
        nodeTypes={mindmapNodeTypes[orientation] as NodeTypes}
        edgeTypes={edgeTypes as EdgeTypes}
        fitView
      >
        <Controls />
        <Background />
        <MiniMap className="hidden md:block" />
      </ReactFlow>
      <ToolboxContainer />
      {nodeForm.is === `active` && (
        <React.Suspense>
          <NewNodeModalContainer />
        </React.Suspense>
      )}
    </>
  );
};

export { MindmapCreatorContainer };
