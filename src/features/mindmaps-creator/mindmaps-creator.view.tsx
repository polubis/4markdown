import React, { type ComponentType } from 'react';
import { Button } from 'design-system/button';
import { BiArrowBack, BiCog, BiPlus, BiX } from 'react-icons/bi';
import { ThemeSwitcher } from 'design-system/theme-switcher';
import { useMindmapsCreatorStore } from 'store/mindmaps-creator/mindmaps-creator.store';
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  ReactFlowProvider,
  useReactFlow,
  type NodeProps,
  type Node,
  type EdgeProps,
  BaseEdge,
  getBezierPath,
  EdgeLabelRenderer,
  useKeyPress,
} from '@xyflow/react';
import {
  type MindmapEdgeType,
  type MindmapNode,
  type MindmapNodeType,
} from 'api-4markdown-contracts';
import {
  connectMindmapNodes,
  openMindmapSettings,
  removeMindmapNodesConnection,
  startAddingNode,
  updateMindmapEdges,
  updateMindmapNodes,
} from 'store/mindmaps-creator/mindmaps-creator.actions';
import { AppNavLink } from 'components/app-nav-link';
import { formatDistance } from 'date-fns';
import '@xyflow/react/dist/base.css';

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

const NodeFormModalContainer = React.lazy(() =>
  import(`./containers/node-form-modal.container`).then((m) => ({
    default: m.NodeFormModalContainer,
  })),
);

const MindmapSettingsModalContainer = React.lazy(() =>
  import(`./containers/mindmap-settings-modal.container`).then((m) => ({
    default: m.MindmapSettingsModalContainer,
  })),
);

const CurvedEdge: MindmapEdgeTypes['curved'] = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
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

const InternalNode: MindmapNodeTypes['internal'] = ({
  data: { document, name, description },
}) => {
  return (
    <>
      <Handle
        className="!bg-zinc-200 dark:!bg-gray-950 border-zinc-400 dark:border-zinc-700 border-2 w-8 h-2.5 !top-[1px] rounded-md"
        type="target"
        position={Position.Top}
      />
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
      <Handle
        className="!bg-zinc-200 dark:!bg-gray-950 border-zinc-400 dark:border-zinc-700 border-2 w-4 h-4 rounded-full"
        type="source"
        position={Position.Bottom}
      />
    </>
  );
};

const nodeTypes: MindmapNodeTypes = {
  internal: InternalNode,
};

const edgeTypes: MindmapEdgeTypes = {
  curved: CurvedEdge,
};

const MindmapsCreatorView = () => {
  const {
    mindmap: { nodes, edges },
    settings,
    nodeForm,
  } = useMindmapsCreatorStore();
  const { fitView } = useReactFlow();

  const newNodePressed = useKeyPress(`n`);

  React.useLayoutEffect(() => {
    settings.autoFit && fitView({ padding: 24 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.autoFit, nodes.length]);

  React.useEffect(() => {
    newNodePressed && startAddingNode();
  }, [newNodePressed]);

  return (
    <>
      <header className="flex px-4 py-3.5 border-b-2 bg-zinc-200 dark:bg-gray-950 border-zinc-300 dark:border-zinc-800">
        <AppNavLink to="/" title="Back to home page">
          <Button i={1} s={2}>
            <BiArrowBack />
          </Button>
        </AppNavLink>
        <ThemeSwitcher />
      </header>
      <main className="flex h-[calc(100svh-70px)]">
        <aside className="flex flex-col space-y-4 shrink-0 px-4 py-3.5 border-r-2 bg-zinc-200 dark:bg-gray-950 border-zinc-300 dark:border-zinc-800">
          <Button
            i={1}
            s={2}
            title="Create new mindmap node"
            onClick={startAddingNode}
          >
            <BiPlus />
          </Button>
          <Button
            i={1}
            s={2}
            title="Open mindmap settings"
            onClick={openMindmapSettings}
          >
            <BiCog />
          </Button>
        </aside>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={updateMindmapNodes}
          onEdgesChange={updateMindmapEdges}
          onConnect={connectMindmapNodes}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
        >
          <Controls />
          <Background />
        </ReactFlow>
      </main>
      {nodeForm.opened && (
        <React.Suspense>
          <NodeFormModalContainer />
        </React.Suspense>
      )}
      {settings.opened && (
        <React.Suspense>
          <MindmapSettingsModalContainer />
        </React.Suspense>
      )}
    </>
  );
};

const MindmapsCreatorConnectedView = () => (
  <ReactFlowProvider>
    <MindmapsCreatorView />
  </ReactFlowProvider>
);

export { MindmapsCreatorConnectedView as MindmapsCreatorView };
