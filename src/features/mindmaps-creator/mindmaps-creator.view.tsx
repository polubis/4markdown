import React, { type ComponentType } from 'react';
import { Button } from 'design-system/button';
import { BiArrowBack, BiCog, BiPlus } from 'react-icons/bi';
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
} from '@xyflow/react';
import type { MindmapNode, MindmapNodeType } from 'api-4markdown-contracts';
import {
  connectMindmap,
  openMindmapSettings,
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

const InternalNode: MindmapNodeTypes['internal'] = ({
  data: { document, name, description },
}) => {
  return (
    <>
      <Handle
        className="!bg-zinc-200 dark:!bg-gray-950 !border-zinc-400 dark:!border-zinc-700 !border-2 !w-8 !h-2.5 !rounded-md"
        type="target"
        id="target-handle-top"
        position={Position.Top}
      />
      <Handle
        className="!bg-zinc-200 dark:!bg-gray-950 !border-zinc-400 dark:!border-zinc-700 !border-2 !h-8 !w-2.5 !left-[1px] !rounded-md"
        type="target"
        id="target-handle-left"
        position={Position.Left}
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
        className="!bg-zinc-200 dark:!bg-gray-950 !border-zinc-400 dark:!border-zinc-700 !border-2 !w-4 !h-4 rounded-full"
        type="source"
        id="source-handle-bottom"
        position={Position.Bottom}
      />
      <Handle
        className="!bg-zinc-200 dark:!bg-gray-950 !border-zinc-400 dark:!border-zinc-700 !border-2 !-right-[-0.5px] !w-4 !h-4 rounded-full"
        type="source"
        id="source-handle-right"
        position={Position.Right}
      />
    </>
  );
};

const ExternalNode = () => {
  return null;
};

const nodeTypes: MindmapNodeTypes = {
  internal: InternalNode,
  external: ExternalNode,
};

const MindmapsCreatorView = () => {
  const {
    mindmap: { nodes, edges },
    settings,
    nodeForm,
  } = useMindmapsCreatorStore();

  const { fitView } = useReactFlow();

  React.useLayoutEffect(() => {
    settings.autoFit && fitView({ padding: 24 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.autoFit, nodes.length]);

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
          onConnect={connectMindmap}
          nodeTypes={nodeTypes}
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
