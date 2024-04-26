import React from 'react';
import { BackToCreatorLinkContainer } from 'containers/back-to-creator-link.container';
import { DocsBrowseLinkContainer } from 'containers/docs-browse-link.container';
import { AppNavigation } from 'components/app-navigation';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  NodeTypes,
  NodeProps,
  Handle,
  Position,
} from 'reactflow';

import 'reactflow/dist/style.css';
import { MindmapCreatorLinkContainer } from 'containers/mindmap-creator-link.container';

const initialNodes = [
  { id: `1`, position: { x: 0, y: 0 }, data: { label: `1` } },
  { id: `2`, position: { x: 0, y: 100 }, data: { label: `2` } },
  {
    id: `node-1`,
    type: `internal-link`,
    position: { x: 0, y: 300 },
    data: { value: 123 },
  },
];

const initialEdges = [
  { id: `e1-2`, source: `1`, target: `2` },
  { id: `e1-3`, source: `1`, target: `node-1` },
];

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

const nodeTypes: NodeTypes = { 'internal-link': InternalLink };

const MindmapsCreatorView = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = React.useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <>
      <AppNavigation>
        <BackToCreatorLinkContainer />
        <DocsBrowseLinkContainer />
        <MindmapCreatorLinkContainer />
      </AppNavigation>
      <main className="flex h-[calc(100svh-72px)]">
        <aside className="shrink-0 w-[72px] border-r-2 bg-zinc-200 dark:bg-gray-950 border-zinc-300 dark:border-zinc-800">
          s
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

export default MindmapsCreatorView;
