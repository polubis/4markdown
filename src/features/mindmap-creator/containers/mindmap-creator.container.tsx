import type { EdgeProps, EdgeTypes, NodeProps, NodeTypes } from '@xyflow/react';
import { Background, Controls, MiniMap, ReactFlow } from '@xyflow/react';
import React, { type ComponentType } from 'react';
import { useMindmapCreatorState } from 'store/mindmap-creator';
import { usePortal } from 'development-kit/use-portal';
import { Button } from 'design-system/button';
import { BiAddToQueue, BiHorizontalRight, BiTrash } from 'react-icons/bi';
import c from 'classnames';
import {
  connectNodesAction,
  openNodeFormAction,
  resetYourMindmapsAction,
  rotateViewAction,
  startNodesRemovalAction,
  updateEdgesAction,
  updateNodesAction,
} from 'store/mindmap-creator/actions';
import type {
  MindmapCreatorEdge,
  MindmapCreatorNode,
  MindmapCreatorState,
} from 'store/mindmap-creator/models';
import {
  ExternalNodeTileX,
  ExternalNodeTileY,
} from '../components/external-node-tile';
import {
  EmbeddedNodeTileContainerX,
  EmbeddedNodeTileContainerY,
} from './embedded-node-tile.container';
import { SolidEdgeContainer } from './solid-edge.container';
import { selectedNodesSelector } from 'store/mindmap-creator/selectors';
import { NodesRemovalConfirmationContainer } from './nodes-removal-confirmation.container';
import ErrorModal from 'components/error-modal';
import { reloadYourMindmapsAct } from 'acts/reload-your-mindmaps.act';

const NewNodeModalContainer = React.lazy(() =>
  import(`./new-node-modal.container`).then((m) => ({
    default: m.NewNodeModalContainer,
  })),
);

const RemoveSelectedNodesContainer = () => {
  const selectedNodes = useMindmapCreatorState(selectedNodesSelector);

  return (
    <Button
      i={2}
      disabled={selectedNodes.length === 0}
      s={1}
      title="Remove selected nodes"
      onClick={startNodesRemovalAction}
    >
      <BiTrash />
    </Button>
  );
};

const ToolboxContainer = () => {
  const { render } = usePortal();

  return render(
    <nav className="fixed flex justify-center space-x-2 py-2 max-w-sm mx-auto bottom-[126px] right-4 md:right-0 md:left-0 md:bottom-0">
      <RemoveSelectedNodesContainer />
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
  [Orientation in MindmapCreatorState['orientation']]: {
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
  const {
    orientation,
    nodes,
    edges,
    nodeForm,
    nodesRemovalConfirmation,
    mindmaps,
  } = useMindmapCreatorState();

  return (
    <>
      <ReactFlow
        key={orientation}
        nodes={nodes}
        edges={edges}
        onNodesChange={updateNodesAction}
        onEdgesChange={updateEdgesAction}
        onConnect={connectNodesAction}
        nodeTypes={mindmapNodeTypes[orientation] as NodeTypes}
        edgeTypes={edgeTypes as EdgeTypes}
        fitView
      >
        <Controls>
          <Button i={2} s={1} title="Center mindmap" onClick={rotateViewAction}>
            <BiHorizontalRight
              className={c({
                'rotate-90': orientation === `y`,
              })}
            />
          </Button>
        </Controls>
        <Background />
        <MiniMap className="hidden md:block" />
      </ReactFlow>
      <ToolboxContainer />
      {nodeForm.is === `active` && (
        <React.Suspense>
          <NewNodeModalContainer />
        </React.Suspense>
      )}
      {nodesRemovalConfirmation.is === `active` && (
        <NodesRemovalConfirmationContainer />
      )}
      {mindmaps.is === `fail` && (
        <ErrorModal
          heading="Cannot load your mindmaps"
          message={mindmaps.error.message}
          footer={
            <Button
              i={2}
              s={2}
              auto
              title="Sync mindmap"
              onClick={reloadYourMindmapsAct}
            >
              Reload
            </Button>
          }
          onClose={resetYourMindmapsAction}
        />
      )}
    </>
  );
};

export { MindmapCreatorContainer };
