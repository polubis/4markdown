import React from 'react';
import {
  Edge,
  Node,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from 'reactflow';
import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

interface MindmapsCreatorProviderContext {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes(setter: (nodes: Node[]) => Node[]): void;
  setEdges(setter: (edges: Edge[]) => Edge[]): void;
}

interface MindmapsCreatorProviderProps {
  children: React.ReactNode;
}

const Context = React.createContext<MindmapsCreatorProviderContext | null>(
  null,
);

const selector = (
  state: MindmapsCreatorProviderContext,
): MindmapsCreatorProviderContext => state;

const MindmapsCreatorProvider = ({
  children,
}: MindmapsCreatorProviderProps) => {
  const [useStore] = React.useState(() =>
    create<MindmapsCreatorProviderContext>((set, get) => ({
      nodes: [],
      edges: [],
      onNodesChange: (changes) => {
        set({
          nodes: applyNodeChanges(changes, get().nodes),
        });
      },
      onEdgesChange: (changes) => {
        set({
          edges: applyEdgeChanges(changes, get().edges),
        });
      },
      onConnect: (connection) => {
        set({
          edges: addEdge(connection, get().edges),
        });
      },
      setNodes: (setter) => {
        set({ nodes: setter(get().nodes) });
      },
      setEdges: (setter) => {
        set({ edges: setter(get().edges) });
      },
    })),
  );

  const store = useStore(useShallow(selector));

  return <Context.Provider value={store}>{children}</Context.Provider>;
};
const useMindmapsCreatorCtx = (): MindmapsCreatorProviderContext => {
  const ctx = React.useContext(Context);

  if (!ctx) throw Error(`Lack of provider`);

  return ctx;
};

export { MindmapsCreatorProvider, useMindmapsCreatorCtx };
