import {
  Background,
  BaseEdge,
  Controls,
  EdgeLabelRenderer,
  type EdgeProps,
  getSimpleBezierPath,
  MiniMap,
  type NodeProps,
  type NodeTypes,
  ReactFlow,
} from '@xyflow/react';
import React, { type ComponentType } from 'react';
import { useMindmapCreatorState } from 'store/mindmap-creator';
import { mindmapCreatorReadySelector } from 'store/mindmap-creator/selectors';
import {
  closeErrorAction,
  connectNodesAction,
  updateEdgesAction,
  updateNodesAction,
} from 'store/mindmap-creator/actions';
import { ActiveNodePreviewContainer } from './active-node-preview.container';
import {
  DocumentNodeTileContainerX,
  DocumentNodeTileContainerY,
} from './document-node-tile.container';
import { RemoveEdgeTriggerContainer } from './remove-edge-trigger.container';
import {
  ExternalNodeTileX,
  ExternalNodeTileY,
} from '../components/external-node-tile';
import type { MindmapDto, MindmapNode } from 'api-4markdown-contracts';
import {
  EmbeddedNodeTileContainerX,
  EmbeddedNodeTileContainerY,
} from './embedded-node-tile.container';
import {
  NestedNodeTileContainerX,
  NestedNodeTileContainerY,
} from './nested-node-tile.container';
import { MindmapToolboxContainer } from './mindmap-toolbox.container';
import { ScreenLoader } from 'design-system/screen-loader';
import ErrorModal from 'components/error-modal';
import { Button } from 'design-system/button';
import { restartMindmapCreatorAct } from 'acts/restart-mindmap-creator.act';

const DoneEdge = ({ id, sourceX, sourceY, targetX, targetY }: EdgeProps) => {
  const [edgePath, labelX, labelY] = getSimpleBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <BaseEdge
        className="!stroke-green-400 dark:!stroke-green-700"
        id={id}
        path={edgePath}
      />
      <EdgeLabelRenderer>
        <RemoveEdgeTriggerContainer labelX={labelX} labelY={labelY} id={id} />
      </EdgeLabelRenderer>
    </>
  );
};

const VisitedEdge = ({ id, sourceX, sourceY, targetX, targetY }: EdgeProps) => {
  const [edgePath, labelX, labelY] = getSimpleBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <BaseEdge
        className="!stroke-zinc-400 dark:!stroke-zinc-700"
        id={id}
        path={edgePath}
      />
      <EdgeLabelRenderer>
        <RemoveEdgeTriggerContainer labelX={labelX} labelY={labelY} id={id} />
      </EdgeLabelRenderer>
    </>
  );
};

const UnvisitedEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
}: EdgeProps) => {
  const [edgePath, labelX, labelY] = getSimpleBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <BaseEdge
        className="!stroke-zinc-400 dark:!stroke-zinc-700"
        id={id}
        path={edgePath}
        strokeDasharray={5}
      />
      <EdgeLabelRenderer>
        <RemoveEdgeTriggerContainer labelX={labelX} labelY={labelY} id={id} />
      </EdgeLabelRenderer>
    </>
  );
};

type MindmapNodeTypes = {
  [Orientation in MindmapDto['orientation']]: {
    [Type in MindmapNode['type']]: ComponentType<
      NodeProps<Extract<MindmapNode, { type: Type }>>
    >;
  };
};

const nodeTypes: MindmapNodeTypes = {
  x: {
    document: DocumentNodeTileContainerX,
    external: ExternalNodeTileX,
    embedded: EmbeddedNodeTileContainerX,
    nested: NestedNodeTileContainerX,
  },
  y: {
    document: DocumentNodeTileContainerY,
    external: ExternalNodeTileY,
    embedded: EmbeddedNodeTileContainerY,
    nested: NestedNodeTileContainerY,
  },
};

const edgeTypes = {
  visited: VisitedEdge,
  unvisited: UnvisitedEdge,
  done: DoneEdge,
};

const MindmapPreviewContainer = () => {
  const { activeMindmap, saving, error } = useMindmapCreatorState(
    mindmapCreatorReadySelector,
  );

  return (
    <>
      <ReactFlow
        key={`${activeMindmap.id} + ${activeMindmap.orientation}`}
        nodes={activeMindmap.nodes}
        edges={activeMindmap.edges}
        onNodesChange={updateNodesAction}
        onEdgesChange={updateEdgesAction}
        onConnect={connectNodesAction}
        nodeTypes={nodeTypes[activeMindmap.orientation] as NodeTypes}
        edgeTypes={edgeTypes}
        fitView
      >
        <Controls />
        <Background />
        <MiniMap />
      </ReactFlow>
      <MindmapToolboxContainer />
      <ActiveNodePreviewContainer />
      {saving && <ScreenLoader />}
      {error && (
        <ErrorModal
          heading="Cannot update mindmap shape"
          message={error.message}
          footer={
            error.symbol === `out-of-date` && (
              <Button
                i={2}
                s={2}
                auto
                title="Sync mindmap"
                onClick={restartMindmapCreatorAct}
              >
                Sync
              </Button>
            )
          }
          onClose={closeErrorAction}
        />
      )}
    </>
  );
};

export { MindmapPreviewContainer };
