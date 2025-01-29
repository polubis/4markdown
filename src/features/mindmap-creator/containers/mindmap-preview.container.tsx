import {
  Background,
  BaseEdge,
  Controls,
  EdgeLabelRenderer,
  type EdgeProps,
  getSimpleBezierPath,
  MiniMap,
  type NodeTypes,
  ReactFlow,
} from '@xyflow/react';
import React from 'react';
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

// type MindmapNodeTypes = {
//   [Key in MindmapNodeType]: ComponentType<
//     NodeProps<Node<Extract<MindmapNode, { type: Key }>['data']>>
//   >;
// };

// type MindmapEdgeTypes = {
//   [Key in MindmapEdgeType]: ComponentType<
//     EdgeProps & {
//       data: {};
//       type: MindmapEdgeType;
//     }
//   >;
// };

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

const ExternalNodeTileX = () => {};

const ExternalNodeTileY = () => {};

const nodeTypes = {
  x: {
    document: DocumentNodeTileContainerX,
    external: ExternalNodeTileX,
  },
  y: {
    document: DocumentNodeTileContainerY,
    external: ExternalNodeTileY,
  },
};

const edgeTypes = {
  visited: VisitedEdge,
  unvisited: UnvisitedEdge,
  done: DoneEdge,
};

const MindmapPreviewContainer = () => {
  const { mindmap } = useMindmapCreatorState(mindmapReadySelector);

  return (
    <>
      <ReactFlow
        //   key={mindmap.orientation}
        nodes={mindmap.nodes}
        edges={mindmap.edges}
        onNodesChange={updateNodesAction}
        onEdgesChange={updateEdgesAction}
        onConnect={connectNodesAction}
        nodeTypes={nodeTypes.y as NodeTypes}
        edgeTypes={edgeTypes}
        fitView
        //   minZoom={viewInformation.minZoom}
        //   maxZoom={viewInformation.maxZoom}
      >
        <Controls />
        <Background />
        <MiniMap />
      </ReactFlow>
      <ActiveNodePreviewContainer />
    </>
  );
};

export { MindmapPreviewContainer };
