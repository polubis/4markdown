import {
  Background,
  BaseEdge,
  Controls,
  EdgeLabelRenderer,
  getSimpleBezierPath,
  Handle,
  MiniMap,
  Position,
  ReactFlow,
} from '@xyflow/react';
import React from 'react';
import c from 'classnames';
import { meta } from '../../../../meta';
import { Button } from 'design-system/button';
import { BiX } from 'react-icons/bi';
import { useMindmapCreatorState } from 'store/mindmap-creator';
import { mindmapReadySelector } from 'store/mindmap-creator/selectors';
import {
  updateEdgesAction,
  updateNodesAction,
} from 'store/mindmap-creator/actions';

const VisitedEdge = ({ id, sourceX, sourceY, targetX, targetY }) => {
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
          // onClick={() => mindmapCreatorStoreActions.removeNodesConnection(id)}
        >
          <BiX />
        </Button>
      </EdgeLabelRenderer>
    </>
  );
};

const DocumentNode = ({ data: { name, description }, selected }) => (
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

const DocumentNodeX = (props) => (
  <>
    <Handle
      className="!bg-zinc-200 dark:!bg-gray-950 border-zinc-400 dark:border-zinc-700 border-2 w-2.5 h-8 !left-[1px] rounded-md"
      type="target"
      position={Position.Left}
    />
    <DocumentNode {...props} />
    <Handle
      className="!bg-zinc-200 dark:!bg-gray-950 border-zinc-400 dark:border-zinc-700 border-2 w-4 h-4 !right-[1px] rounded-full"
      type="source"
      position={Position.Right}
    />
  </>
);

const DocumentNodeY = (props) => (
  <>
    <Handle
      className="!bg-zinc-200 dark:!bg-gray-950 border-zinc-400 dark:border-zinc-700 border-2 w-8 h-2.5 !top-[1px] rounded-md"
      type="target"
      position={Position.Top}
    />
    <DocumentNode {...props} />
    <Handle
      className="!bg-zinc-200 dark:!bg-gray-950 border-zinc-400 dark:border-zinc-700 border-2 w-4 h-4 rounded-full"
      type="source"
      position={Position.Bottom}
    />
  </>
);

const nodeTypes = {
  x: {
    document: DocumentNodeX,
  },
  y: {
    document: DocumentNodeY,
  },
};

const edgeTypes = {
  visited: VisitedEdge,
};

const MindmapPreviewContainer = () => {
  const { mindmap } = useMindmapCreatorState(mindmapReadySelector);

  return (
    <ReactFlow
      id="mindmap-preview"
      //   key={mindmap.orientation}
      nodes={mindmap.nodes}
      edges={mindmap.edges}
      onNodesChange={updateNodesAction}
      onEdgesChange={updateEdgesAction}
      //   onConnect={mindmapCreatorStoreActions.connectNodes}
      nodeTypes={nodeTypes[`y`]}
      edgeTypes={edgeTypes}
      fitView
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
