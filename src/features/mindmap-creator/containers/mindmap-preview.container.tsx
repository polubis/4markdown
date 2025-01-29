import {
  Background,
  BaseEdge,
  Controls,
  EdgeLabelRenderer,
  type EdgeProps,
  getSimpleBezierPath,
  Handle,
  MiniMap,
  type NodeProps,
  type NodeTypes,
  Position,
  ReactFlow,
} from '@xyflow/react';
import React, { type ReactNode } from 'react';
import c from 'classnames';
import { meta } from '../../../../meta';
import { Button } from 'design-system/button';
import { BiX } from 'react-icons/bi';
import { useMindmapCreatorState } from 'store/mindmap-creator';
import { mindmapReadySelector } from 'store/mindmap-creator/selectors';
import {
  connectNodesAction,
  toggleMindmapNodeAction,
  removeNodesConnectionAction,
  updateEdgesAction,
  updateNodesAction,
} from 'store/mindmap-creator/actions';
import type { DocumentNode, MindmapNode } from 'api-4markdown-contracts';
import { ActiveNodePreviewContainer } from './active-node-preview.container';

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

type DocumentNodeTileProps = NodeProps<DocumentNode> & { selected: boolean };

const HandleX = ({ children }: { children: ReactNode }) => (
  <>
    <Handle
      className="!bg-zinc-200 dark:!bg-gray-950 border-zinc-400 dark:border-zinc-700 border-2 w-2.5 h-8 !left-[1px] rounded-md"
      type="target"
      position={Position.Left}
    />
    {children}
    <Handle
      className="!bg-zinc-200 dark:!bg-gray-950 border-zinc-400 dark:border-zinc-700 border-2 w-4 h-4 !right-[1px] rounded-full"
      type="source"
      position={Position.Right}
    />
  </>
);

const HandleY = ({ children }: { children: ReactNode }) => (
  <>
    <Handle
      className="!bg-zinc-200 dark:!bg-gray-950 border-zinc-400 dark:border-zinc-700 border-2 w-8 h-2.5 !top-[1px] rounded-md"
      type="target"
      position={Position.Top}
    />
    {children}
    <Handle
      className="!bg-zinc-200 dark:!bg-gray-950 border-zinc-400 dark:border-zinc-700 border-2 w-4 h-4 rounded-full"
      type="source"
      position={Position.Bottom}
    />
  </>
);

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
        <Button
          i={2}
          s="auto"
          rounded
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: `all`,
          }}
          className="nodrag nopan absolute h-5 w-5"
          onClick={() => removeNodesConnectionAction(id)}
        >
          <BiX />
        </Button>
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
        <Button
          i={2}
          s="auto"
          rounded
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: `all`,
          }}
          className="nodrag nopan absolute h-5 w-5"
          onClick={() => removeNodesConnectionAction(id)}
        >
          <BiX />
        </Button>
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
        <Button
          i={2}
          s="auto"
          rounded
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: `all`,
          }}
          className="nodrag nopan absolute h-5 w-5"
          onClick={() => removeNodesConnectionAction(id)}
        >
          <BiX />
        </Button>
      </EdgeLabelRenderer>
    </>
  );
};

const NodeTile = ({
  selected,
  children,
  id,
  onClick,
}: {
  id: MindmapNode['id'];
  selected: boolean;
  onClick(id: MindmapNode['id']): void;
  children: ReactNode;
}) => {
  return (
    <div
      className={c(
        `flex flex-col cursor-pointer border-2 rounded-lg px-4 py-3 bg-zinc-200 dark:hover:bg-gray-900 dark:bg-gray-950 hover:bg-zinc-300 w-[280px]`,
        selected
          ? `border-black dark:border-white`
          : `border-zinc-300 dark:border-zinc-800`,
      )}
      onClick={() => onClick(id)}
    >
      {children}
    </div>
  );
};

// eslint-disable-next-line react/display-name
NodeTile.Name = ({ children }: { children: ReactNode }) => {
  return <h6 className="font-bold line-clamp-2">{children}</h6>;
};
// eslint-disable-next-line react/display-name
NodeTile.Label = ({ children }: { children: ReactNode }) => {
  return (
    <p className="text-sm capitalize mb-0.5 italic line-clamp-4">{children}</p>
  );
};

// eslint-disable-next-line react/display-name
NodeTile.Description = ({ children }: { children: ReactNode }) => {
  return <p className="mt-1">{children}</p>;
};

const DocumentNodeTile = ({
  id,
  data: { name, description },
  selected,
}: DocumentNodeTileProps) => (
  <NodeTile selected={selected} id={id} onClick={toggleMindmapNodeAction}>
    <NodeTile.Label>{meta.appName} Document</NodeTile.Label>
    <NodeTile.Name>{name}</NodeTile.Name>
    {description && <NodeTile.Description>{description}</NodeTile.Description>}
  </NodeTile>
);

const DocumentNodeTileX = (props: DocumentNodeTileProps) => (
  <HandleX>
    <DocumentNodeTile {...props} />
  </HandleX>
);

const DocumentNodeTileY = (props: DocumentNodeTileProps) => (
  <HandleY>
    <DocumentNodeTile {...props} />
  </HandleY>
);

const ExternalNodeTileX = () => {};

const ExternalNodeTileY = () => {};

const nodeTypes = {
  x: {
    document: DocumentNodeTileX,
    external: ExternalNodeTileX,
  },
  y: {
    document: DocumentNodeTileY,
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
