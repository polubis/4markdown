import React, { type ComponentType } from 'react';
import { Button } from 'design-system/button';
import { BiX } from 'react-icons/bi';
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  type NodeProps,
  type Node,
  type EdgeProps,
  BaseEdge,
  EdgeLabelRenderer,
  useKeyPress,
  useReactFlow,
  ReactFlowProvider,
  getSimpleBezierPath,
} from '@xyflow/react';
import {
  type MindmapOrientation,
  type MindmapEdgeType,
  type MindmapNode,
  type MindmapNodeType,
} from 'api-4markdown-contracts';
import {
  connectMindmapNodes,
  removeMindmapNodesConnection,
  startAddingNode,
  updateMindmapEdges,
  updateMindmapNodes,
} from 'store/mindmaps-creator/mindmaps-creator.actions';
import { formatDistance } from 'date-fns';
import '@xyflow/react/dist/base.css';
import '../mindmaps-creator.css';
import { mindmapsCreatorStoreSelectors } from 'store/mindmaps-creator/mindmaps-creator.store';

type MindmapNodeTypes = {
  [Key in MindmapNodeType]: ComponentType<
    NodeProps<Node<Extract<MindmapNode, { type: MindmapNodeType }>['data']>>
  >;
};

type MindmapEdgeTypes = {
  [Key in MindmapEdgeType]: ComponentType<
    EdgeProps & {
      data: {};
      type: MindmapEdgeType;
    }
  >;
};

const CurvedEdge: MindmapEdgeTypes['curved'] = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
}) => {
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
        <Button
          i={2}
          s="auto"
          rounded
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: `all`,
          }}
          className="nodrag nopan absolute h-5 w-5"
          onClick={() => removeMindmapNodesConnection(id)}
        >
          <BiX />
        </Button>
      </EdgeLabelRenderer>
    </>
  );
};

const InternalNode = ({
  document,
  description,
  name,
}: Extract<MindmapNode, { type: `internal` }>['data']) => (
  <div
    className={`flex flex-col cursor-pointer border-2 rounded-lg px-4 py-3 bg-zinc-200 dark:hover:bg-gray-900 dark:bg-gray-950 hover:bg-zinc-300 border-zinc-300 dark:border-zinc-800 min-w-[240px]`}
    title={name}
  >
    <div className="flex justify-between mb-0.5">
      <p className="text-sm capitalize">
        Edited{` `}
        {formatDistance(new Date(), document.mdate, {
          addSuffix: true,
        })}
        {` `}
        ago
      </p>
    </div>
    <h6 className="font-bold">{name}</h6>
    {description && <p className="mt-1">{description}</p>}
  </div>
);

const InternalNodeX: MindmapNodeTypes['internal'] = ({ data }) => {
  return (
    <>
      <Handle
        className="!bg-zinc-200 dark:!bg-gray-950 border-zinc-400 dark:border-zinc-700 border-2 w-2.5 h-8 !left-[1px] rounded-md"
        type="target"
        position={Position.Left}
      />
      <InternalNode {...data} />
      <Handle
        className="!bg-zinc-200 dark:!bg-gray-950 border-zinc-400 dark:border-zinc-700 border-2 w-4 h-4 !right-[1px] rounded-full"
        type="source"
        position={Position.Right}
      />
    </>
  );
};

const InternalNodeY: MindmapNodeTypes['internal'] = ({ data }) => {
  return (
    <>
      <Handle
        className="!bg-zinc-200 dark:!bg-gray-950 border-zinc-400 dark:border-zinc-700 border-2 w-8 h-2.5 !top-[1px] rounded-md"
        type="target"
        position={Position.Top}
      />
      <InternalNode {...data} />
      <Handle
        className="!bg-zinc-200 dark:!bg-gray-950 border-zinc-400 dark:border-zinc-700 border-2 w-4 h-4 rounded-full"
        type="source"
        position={Position.Bottom}
      />
    </>
  );
};

const nodeTypes: Record<MindmapOrientation, MindmapNodeTypes> = {
  x: {
    internal: InternalNodeX,
  },
  y: {
    internal: InternalNodeY,
  },
};

const edgeTypes: MindmapEdgeTypes = {
  curved: CurvedEdge,
};

const MindmapPreviewContainer = () => {
  const { mindmap, settings } = mindmapsCreatorStoreSelectors.useOk();

  const { fitView } = useReactFlow();

  const newNodePressed = useKeyPress(`n`);

  React.useLayoutEffect(() => {
    if (settings.autoFit) {
      fitView({ padding: 24 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  React.useEffect(() => {
    newNodePressed && startAddingNode();
  }, [newNodePressed]);

  return (
    <ReactFlow
      key={mindmap.orientation}
      nodes={mindmap.nodes}
      edges={mindmap.edges}
      onNodesChange={updateMindmapNodes}
      onEdgesChange={updateMindmapEdges}
      onConnect={connectMindmapNodes}
      nodeTypes={nodeTypes[mindmap.orientation]}
      edgeTypes={edgeTypes}
      fitView
    >
      <Controls />
      <Background />
    </ReactFlow>
  );
};

const MindmapPreviewConnectedContainer = () => (
  <ReactFlowProvider>
    <MindmapPreviewContainer />
  </ReactFlowProvider>
);

export { MindmapPreviewConnectedContainer as MindmapPreviewContainer };
