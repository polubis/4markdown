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
  MiniMap,
  Position,
  type NodeProps,
} from 'reactflow';
import type {
  MindmapInternalNode,
  MindmapNodeType,
} from 'api-4markdown-contracts';
import {
  connectMindmap,
  updateMindmapEdges,
  updateMindmapNodes,
} from 'store/mindmaps-creator/mindmaps-creator.actions';
import 'reactflow/dist/style.css';

const InternalNode = ({
  data: { document, name, description },
}: NodeProps<MindmapInternalNode['data']>) => {
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div className="rounded-md bg-zinc-200 dark:bg-gray-950 border-zinc-300 dark:border-zinc-800 border-2 p-4">
        <div>
          <strong className="text-md">{name}</strong>
          <p>
            {document.visibility === `private` && (
              <BiLowVision size="20" title="This document is private" />
            )}
            {document.visibility === `public` && (
              <BiShow size="20" title="This document is public" />
            )}
            {document.visibility === `permanent` && (
              <BiWorld size="20" title="This document is permanent" />
            )}
          </p>
        </div>
        <p>{description}</p>
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
  } = useMindmapsCreatorStore();

  return (
    <>
      <header className="flex px-4 py-3.5 border-b-2 bg-zinc-200 dark:bg-gray-950 border-zinc-300 dark:border-zinc-800">
        <Button i={1} s={2} title="Back to home page">
          <BiArrowBack />
        </Button>
        <ThemeSwitcher />
      </header>
      <main className="flex h-[calc(100svh-70px)]">
        <aside className="flex flex-col space-y-4 shrink-0 px-4 py-3.5 border-r-2 bg-zinc-200 dark:bg-gray-950 border-zinc-300 dark:border-zinc-800">
          <Button i={1} s={2} title="Create new mindmap node">
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
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </main>
    </>
  );
};

export { MindmapsCreatorView };
