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
import { MindmapsCreatorProvider } from './providers/mindmaps-creator.provider';
import { useMindmapsCreatorManagement } from './logic/use-mindmaps-creator-management';

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

const InitialNode = (props: NodeProps) => {
  return (
    <form className="bg-zinc-200 dark:bg-gray-950 border-zinc-300 dark:border-zinc-800 p-4 rounded-md border">
      <h6 className="text-md mb-4">Create Node</h6>
      <footer className="flex space-x-2">
        <Button type="button" i={2} s={1} auto title="Cancel node creation">
          Cancel
        </Button>
        <Button type="submit" i={2} s={1} auto title="Confirm node creation">
          Confirm
        </Button>
      </footer>
    </form>
  );
};

const nodeTypes: NodeTypes = {
  'internal-link': InternalLink,
  initial: InitialNode,
};

const MindmapsCreatorView = () => {
  const { nodes, edges, onConnect, onEdgesChange, onNodesChange, addNode } =
    useMindmapsCreatorManagement();

  return (
    <>
      <MindmapNavigation>
        <BackToCreatorLinkContainer />
        <DocsBrowseLinkContainer />
        <MindmapCreatorLinkContainer />
      </MindmapNavigation>
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
