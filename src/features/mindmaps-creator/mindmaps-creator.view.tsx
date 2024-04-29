import React from 'react';
import { BackToCreatorLinkContainer } from 'containers/back-to-creator-link.container';
import { DocsBrowseLinkContainer } from 'containers/docs-browse-link.container';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  NodeTypes,
  NodeProps,
  Handle,
  Position,
} from 'reactflow';
import { MindmapCreatorLinkContainer } from 'containers/mindmap-creator-link.container';
import { MindmapNavigation } from './components/mindmap-navigation';
import 'reactflow/dist/style.css';
import { Button } from 'design-system/button';
import { BiPlus } from 'react-icons/bi';
import {
  MindmapsCreatorProvider,
  useMindmapsCreatorCtx,
} from './providers/mindmaps-creator.provider';
import { Status } from 'design-system/status';
import { InitialNodeContainer } from './containers/initial-node.container';

const handleStyle = { left: 10 };

const InternalLink = ({ data }: NodeProps) => {
  const onChange = React.useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div>
        <label htmlFor="text">Text:</label>
        <input id="text" name="text" onChange={onChange} className="nodrag" />
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        style={handleStyle}
      />
    </>
  );
};

const nodeTypes: NodeTypes = {
  internal: InternalLink,
  initial: InitialNodeContainer,
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
    onEdgesChange,
    onNodesChange,
  } = useMindmapsCreatorCtx();

  const addNode = (): void => {
    setNodes((prevNodes) => [
      ...prevNodes,
      {
        id: generateId(),
        position: { x: 0, y: 0 },
        data: { label: `test` },
        type: `initial`,
      },
    ]);
  };

  React.useEffect(() => {
    setNodes(() => [
      { id: `1`, position: { x: 0, y: 0 }, data: { label: `1` } },
      { id: `2`, position: { x: 0, y: 100 }, data: { label: `2` } },
      {
        id: `node-1`,
        type: `internal`,
        position: { x: 0, y: 300 },
        data: { value: 123 },
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
          <Button i={1} s={2} title="Add node" onClick={addNode}>
            <BiPlus size={24} />
          </Button>
        </aside>
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
      </main>
    </>
  );
};

const ConnectedMindmapsCreatorView = () => (
  <MindmapsCreatorProvider>
    <MindmapsCreatorView />
  </MindmapsCreatorProvider>
);

export default ConnectedMindmapsCreatorView;
