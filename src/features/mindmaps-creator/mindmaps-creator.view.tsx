import React from 'react';
import { BackToCreatorLinkContainer } from 'containers/back-to-creator-link.container';
import { DocsBrowseLinkContainer } from 'containers/docs-browse-link.container';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  NodeTypes,
  Handle,
  Position,
  NodeProps,
} from 'reactflow';
import { MindmapCreatorLinkContainer } from 'containers/mindmap-creator-link.container';
import { MindmapNavigation } from './components/mindmap-navigation';
import 'reactflow/dist/style.css';
import { Button } from 'design-system/button';
import { BiLowVision, BiPlus, BiShow, BiWorld } from 'react-icons/bi';
import {
  MindmapsCreatorProvider,
  useMindmapsCreatorCtx,
} from './providers/mindmaps-creator.provider';
import { Status } from 'design-system/status';
import { useDocsStore } from 'store/docs/docs.store';
import { useToggle } from 'development-kit/use-toggle';
import { NodeFormModalProps } from './components/node-form-modal';
import { InternalMindmapNodeData } from 'models/mindmap';

const NodeFormModal = React.lazy(() => import(`./components/node-form-modal`));

const InternalNode = (props: NodeProps<InternalMindmapNodeData>) => {
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div className="rounded-md bg-zinc-200 dark:bg-gray-950 border-zinc-300 dark:border-zinc-800 border-2 p-4">
        <div>
          <strong className="text-md">{props.data.name}</strong>
          <p>
            {props.data.doc.visibility === `private` && (
              <BiLowVision size="20" title="This document is private" />
            )}
            {props.data.doc.visibility === `public` && (
              <BiShow size="20" title="This document is public" />
            )}
            {props.data.doc.visibility === `permanent` && (
              <BiWorld size="20" title="This document is permanent" />
            )}
          </p>
        </div>
        <p>{props.data.description}</p>
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

const nodeTypes: NodeTypes = {
  internal: InternalNode,
  external: ExternalNode,
};

const generateId = (): string => new Date().toISOString();

const MindmapsCreatorView = () => {
  const {
    nodes,
    edges,
    operation,
    setNodes,
    setEdges,
    onConnect,
    setOperation,
    onEdgesChange,
    onNodesChange,
  } = useMindmapsCreatorCtx();
  const nodeFormModal = useToggle();
  const docsStore = useDocsStore();

  const addNode: NodeFormModalProps['onConfirm'] = (node): void => {
    setOperation(`node-added`);
    setNodes((prevNodes) => [
      ...prevNodes,
      {
        id: generateId(),
        position: { x: 0, y: 0 },
        height: null,
        width: null,
        data: node.data,
        type: node.type,
      },
    ]);
    setOperation(`idle`, 3000);

    nodeFormModal.close();
  };

  React.useEffect(() => {
    setNodes(() => [
      {
        id: `1`,
        position: { x: 0, y: 0 },
        height: null,
        width: null,
        data: {
          url: `https://google.com`,
          name: `Test`,
          description: `dasdasdasdasddasdds`,
        },
        type: `external`,
      },
      {
        id: `2`,
        position: { x: 0, y: 100 },
        height: null,
        width: null,
        data: {
          url: `https://google.com`,
          name: `Test`,
          description: `dasdasdasdasddasdds`,
        },
        type: `external`,
      },
      {
        id: `node-1`,
        position: { x: 0, y: 300 },
        height: null,
        width: null,
        data: {
          url: `https://google.com`,
          name: `Test`,
          description: `dasdasdasdasddasdds`,
        },
        type: `external`,
      },
    ]);
    setEdges(() => [
      { id: `e1-2`, source: `1`, target: `2` },
      { id: `e1-3`, source: `1`, target: `node-1` },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <MindmapNavigation>
        <BackToCreatorLinkContainer />
        <DocsBrowseLinkContainer />
        <MindmapCreatorLinkContainer />
      </MindmapNavigation>
      <Status open={operation === `node-added`}>New node added</Status>
      <main className="flex h-[calc(100svh-72px)]">
        <aside className="py-4 flex flex-col items-center space-y-4 shrink-0 w-[66px] border-r-2 bg-zinc-200 dark:bg-gray-950 border-zinc-300 dark:border-zinc-800">
          <Button
            disabled={docsStore.is !== `ok`}
            i={1}
            s={2}
            title="Create new node"
            onClick={nodeFormModal.open}
          >
            <BiPlus size={24} />
          </Button>
        </aside>
        {docsStore.is === `ok` && (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
          >
            <MiniMap />
            <Controls />
            <Background />
          </ReactFlow>
        )}
      </main>

      {nodeFormModal.opened && (
        <React.Suspense>
          <NodeFormModal onClose={nodeFormModal.close} onConfirm={addNode} />
        </React.Suspense>
      )}
    </>
  );
};

const ConnectedMindmapsCreatorView = () => (
  <MindmapsCreatorProvider>
    <MindmapsCreatorView />
  </MindmapsCreatorProvider>
);

export default ConnectedMindmapsCreatorView;
