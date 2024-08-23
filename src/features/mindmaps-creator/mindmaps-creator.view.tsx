import React, { type ComponentType } from 'react';
import { Button } from 'design-system/button';
import {
  BiArrowBack,
  BiLowVision,
  BiPlus,
  BiShow,
  BiWorld,
} from 'react-icons/bi';
import { ThemeSwitcher } from 'design-system/theme-switcher';
import { useMindmapsCreatorStore } from 'store/mindmaps-creator/mindmaps-creator.store';
import ReactFlow, {
  Background,
  Controls,
  Handle,
  Position,
  ReactFlowProvider,
  useReactFlow,
  type NodeProps,
} from 'reactflow';
import type {
  MindmapInternalNode,
  MindmapNodeType,
} from 'api-4markdown-contracts';
import {
  connectMindmap,
  startAddingNode,
  updateMindmapEdges,
  updateMindmapNodes,
} from 'store/mindmaps-creator/mindmaps-creator.actions';
import 'reactflow/dist/style.css';
import { AppNavLink } from 'components/app-nav-link';
import { formatDistance } from 'date-fns';

const NodeFormModal = React.lazy(() =>
  import(`./components/node-form-modal`).then((m) => ({
    default: m.NodeFormModal,
  })),
);

// https://reactflow.dev/learn/tutorials/mind-map-app-with-react-flow

const InternalNode = ({
  data: { document, name, description },
}: NodeProps<MindmapInternalNode['data']>) => {
  return (
    <>
      <Handle type="target" position={Position.Top} />
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
          <strong className="ml-4">
            {document.visibility === `private` && (
              <BiLowVision size={20} title="This document is private" />
            )}
            {document.visibility === `public` && (
              <BiShow size={20} title="This document is public" />
            )}
            {document.visibility === `permanent` && (
              <BiWorld size={20} title="This document is permanent" />
            )}
          </strong>
        </div>
        <h6 className="font-bold">{name}</h6>
        {description && <p className="mt-1">{description}</p>}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
};

const ExternalNode = () => {
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div>
        <label htmlFor="text">ExternalNode</label>
        <input id="text" name="text" className="nodrag" />
      </div>
      <Handle type="source" position={Position.Bottom} />
      <Handle type="source" position={Position.Bottom} />
    </>
  );
};

const nodeTypes: Record<MindmapNodeType, ComponentType<NodeProps>> = {
  internal: InternalNode,
  external: ExternalNode,
};

const MindmapsCreatorView = () => {
  const {
    mindmap: { nodes, edges },
    nodeForm,
  } = useMindmapsCreatorStore();

  const { fitView } = useReactFlow();

  React.useLayoutEffect(() => {
    fitView({ padding: 24 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes.length]);

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
          <NodeFormModal />
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
