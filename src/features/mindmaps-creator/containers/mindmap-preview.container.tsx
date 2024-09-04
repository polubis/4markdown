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
  getSimpleBezierPath,
} from '@xyflow/react';
import {
  type MindmapOrientation,
  type MindmapEdgeType,
  type MindmapNode,
  type MindmapNodeType,
} from 'api-4markdown-contracts';
import '@xyflow/react/dist/base.css';
import '../mindmaps-creator.css';
import {
  mindmapsCreatorStoreActions,
  mindmapsCreatorStoreSelectors,
} from 'store/mindmaps-creator/mindmaps-creator.store';
import c from 'classnames';
import { meta } from '../../../../meta';
import { useViewCenter } from '../core/use-view-center';

type MindmapNodeTypes = {
  [Key in MindmapNodeType]: ComponentType<
    NodeProps<Node<Extract<MindmapNode, { type: Key }>['data']>>
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
          onClick={() => mindmapsCreatorStoreActions.removeNodesConnection(id)}
        >
          <BiX />
        </Button>
      </EdgeLabelRenderer>
    </>
  );
};

const InternalNode = ({
  description,
  name,
  selected,
}: Extract<MindmapNode, { type: `internal` }>['data'] & {
  selected?: boolean;
}) => (
  <div
    className={c(
      `flex flex-col cursor-pointer border-2 rounded-lg px-4 py-3 bg-zinc-200 dark:hover:bg-gray-900 dark:bg-gray-950 hover:bg-zinc-300 w-[280px]`,
      selected
        ? `border-black dark:border-white`
        : `border-zinc-300 dark:border-zinc-800`,
    )}
    title={name}
  >
    <p className="text-sm capitalize mb-0.5 italic line-clamp-4">
      {meta.appName} Document
    </p>
    <h6 className="font-bold line-clamp-2">{name}</h6>
    {description && <p className="mt-1">{description}</p>}
  </div>
);

const ExternalNode = ({
  description,
  name,
  selected,
}: Extract<MindmapNode, { type: `external` }>['data'] & {
  selected?: boolean;
}) => (
  <div
    className={c(
      `flex flex-col cursor-pointer border-2 rounded-lg px-4 py-3 bg-zinc-200 dark:hover:bg-gray-900 dark:bg-gray-950 hover:bg-zinc-300 w-[280px]`,
      selected
        ? `border-black dark:border-white`
        : `border-zinc-300 dark:border-zinc-800`,
    )}
    title={name}
  >
    <p className="text-sm capitalize mb-0.5 italic line-clamp-4">
      External Resource
    </p>
    <h6 className="font-bold line-clamp-2">{name}</h6>
    {description && <p className="mt-1">{description}</p>}
  </div>
);

const InternalNodeX: MindmapNodeTypes['internal'] = ({ data, selected }) => {
  return (
    <>
      <Handle
        className="!bg-zinc-200 dark:!bg-gray-950 border-zinc-400 dark:border-zinc-700 border-2 w-2.5 h-8 !left-[1px] rounded-md"
        type="target"
        position={Position.Left}
      />
      <InternalNode {...data} selected={selected} />
      <Handle
        className="!bg-zinc-200 dark:!bg-gray-950 border-zinc-400 dark:border-zinc-700 border-2 w-4 h-4 !right-[1px] rounded-full"
        type="source"
        position={Position.Right}
      />
    </>
  );
};

const InternalNodeY: MindmapNodeTypes['internal'] = ({ data, selected }) => {
  return (
    <>
      <Handle
        className="!bg-zinc-200 dark:!bg-gray-950 border-zinc-400 dark:border-zinc-700 border-2 w-8 h-2.5 !top-[1px] rounded-md"
        type="target"
        position={Position.Top}
      />
      <InternalNode {...data} selected={selected} />
      <Handle
        className="!bg-zinc-200 dark:!bg-gray-950 border-zinc-400 dark:border-zinc-700 border-2 w-4 h-4 rounded-full"
        type="source"
        position={Position.Bottom}
      />
    </>
  );
};

const ExternalNodeX: MindmapNodeTypes['external'] = ({ data, selected }) => {
  return (
    <>
      <Handle
        className="!bg-zinc-200 dark:!bg-gray-950 border-zinc-400 dark:border-zinc-700 border-2 w-2.5 h-8 !left-[1px] rounded-md"
        type="target"
        position={Position.Left}
      />
      <ExternalNode {...data} selected={selected} />
      <Handle
        className="!bg-zinc-200 dark:!bg-gray-950 border-zinc-400 dark:border-zinc-700 border-2 w-4 h-4 !right-[1px] rounded-full"
        type="source"
        position={Position.Right}
      />
    </>
  );
};

const ExternalNodeY: MindmapNodeTypes['external'] = ({ data, selected }) => {
  return (
    <>
      <Handle
        className="!bg-zinc-200 dark:!bg-gray-950 border-zinc-400 dark:border-zinc-700 border-2 w-8 h-2.5 !top-[1px] rounded-md"
        type="target"
        position={Position.Top}
      />
      <ExternalNode {...data} selected={selected} />
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
    external: ExternalNodeX,
  },
  y: {
    internal: InternalNodeY,
    external: ExternalNodeY,
  },
};

const edgeTypes: MindmapEdgeTypes = {
  curved: CurvedEdge,
};

const MindmapPreviewContainer = () => {
  const { mindmap, settings } = mindmapsCreatorStoreSelectors.useOk();
  const { centerViewWhenSafe, centerView } = useViewCenter();

  const nodesRemovedPressed = useKeyPress(`d`);
  const layoutCentered = useKeyPress(`c`);

  React.useEffect(() => {
    const selectedNodes = mindmapsCreatorStoreSelectors.selectedNodes();

    if (nodesRemovedPressed && selectedNodes.length > 0) {
      mindmapsCreatorStoreActions.startNodesRemoval();
    }
  }, [nodesRemovedPressed]);

  React.useEffect(() => {
    if (layoutCentered) {
      centerView();
    }
  }, [layoutCentered, centerView]);

  React.useEffect(() => {
    centerViewWhenSafe();
  }, [centerViewWhenSafe, mindmap.nodes.length]);

  return (
    <ReactFlow
      key={mindmap.orientation}
      nodes={mindmap.nodes}
      edges={mindmap.edges}
      onNodesChange={mindmapsCreatorStoreActions.updateNodes}
      onEdgesChange={mindmapsCreatorStoreActions.updateEdges}
      onConnect={mindmapsCreatorStoreActions.connectNodes}
      nodeTypes={nodeTypes[mindmap.orientation]}
      edgeTypes={edgeTypes}
      fitView={settings.autoFit}
    >
      <Controls />
      <Background />
    </ReactFlow>
  );
};

export { MindmapPreviewContainer };
