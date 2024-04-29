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
import { Field } from 'design-system/field';
import { Input } from 'design-system/input';
import { Tabs } from 'design-system/tabs';
import { Textarea } from 'design-system/textarea';

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
  const [type, setType] = React.useState<`internal` | `external`>(`internal`);

  const { setNodes, setOperation } = useMindmapsCreatorCtx();

  const cancel = (): void => {
    setNodes((nodes) => nodes.filter((node) => node.id !== props.id));
  };

  const confirm: React.FormEventHandler<HTMLFormElement> = (e): void => {
    e.preventDefault();

    setOperation(`node-added`);

    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === props.id ? { ...node, type: `InternalLink` } : node,
      ),
    );

    setOperation(`idle`, 3000);
  };

  return (
    <form
      className="bg-zinc-200 dark:bg-gray-950 border-zinc-300 dark:border-zinc-800 p-4 rounded-md border min-w-[280px]"
      onSubmit={confirm}
    >
      <h6 className="text-xl mb-4">Add Node</h6>
      <section>
        <Tabs className="mb-5">
          <Tabs.Item
            type="button"
            active={type === `internal`}
            onClick={() => setType(`internal`)}
          >
            Internal
          </Tabs.Item>
          <Tabs.Item
            type="button"
            active={type === `external`}
            onClick={() => setType(`external`)}
          >
            External
          </Tabs.Item>
        </Tabs>
        {type === `internal` && (
          <>
            <Field
              className="mb-2"
              label="Source*"
              hint="Select document or mindmap"
            >
              <Input placeholder="Type to search" />
            </Field>
            <Field className="mb-2" label="Name*">
              <Input placeholder="How to make pizza, ...etc" />
            </Field>
            <Field label="Description*">
              <Textarea placeholder="To prepare a pizza, buy the ingredients, ...etc" />
            </Field>
          </>
        )}
      </section>
      <footer className="mt-8 flex space-x-2 justify-end">
        <Button
          type="button"
          i={1}
          s={2}
          auto
          title="Cancel node creation"
          onClick={cancel}
        >
          Cancel
        </Button>
        <Button type="submit" i={2} s={2} auto title="Confirm node creation">
          Confirm
        </Button>
      </footer>
    </form>
  );
};

const nodeTypes: NodeTypes = {
  InternalLink,
  InitialNode,
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
        type: `InitialNode`,
      },
    ]);
  };

  React.useEffect(() => {
    setNodes(() => [
      { id: `1`, position: { x: 0, y: 0 }, data: { label: `1` } },
      { id: `2`, position: { x: 0, y: 100 }, data: { label: `2` } },
      {
        id: `node-1`,
        type: `InternalLink`,
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
