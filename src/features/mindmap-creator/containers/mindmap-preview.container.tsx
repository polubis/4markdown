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
import { mindmapReadySelector } from 'store/mindmap-creator/selectors';
import {
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
import type { Mindmap, MindmapNode } from 'api-4markdown-contracts';
import {
  EmbeddedNodeTileContainerX,
  EmbeddedNodeTileContainerY,
} from './embedded-node-tile.container';
import {
  NestedNodeTileContainerX,
  NestedNodeTileContainerY,
} from './nested-node-tile.container';
import { MindmapToolboxContainer } from './mindmap-toolbox.container';

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
  [Orientation in Mindmap['orientation']]: {
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
  const { activeMindmap } = useMindmapCreatorState(mindmapReadySelector);

  return (
    <>
      <ReactFlow
        //   key={mindmap.orientation}
        nodes={activeMindmap.nodes}
        edges={activeMindmap.edges}
        onNodesChange={updateNodesAction}
        onEdgesChange={updateEdgesAction}
        onConnect={connectNodesAction}
        nodeTypes={nodeTypes[activeMindmap.orientation] as NodeTypes}
        edgeTypes={edgeTypes}
        fitView
        //   minZoom={viewInformation.minZoom}
        //   maxZoom={viewInformation.maxZoom}
      >
        <Controls />
        <Background />
        <MiniMap />
      </ReactFlow>
      <MindmapToolboxContainer />
      <ActiveNodePreviewContainer />
    </>
  );
};

export { MindmapPreviewContainer };
