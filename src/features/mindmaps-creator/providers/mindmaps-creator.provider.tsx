import type { MindmapNode } from 'models/mindmap';
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

type MindmapsCreatorOperation = 'idle' | 'node-added';

interface MindmapsCreatorProviderContext {
  nodes: MindmapNode[];
  edges: Edge[];
  operation: MindmapsCreatorOperation;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes(setter: (nodes: MindmapNode[]) => MindmapNode[]): void;
  setEdges(setter: (edges: Edge[]) => Edge[]): void;
  setOperation(operation: MindmapsCreatorOperation, delay?: number): void;
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
  const operationTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const clearOperationTimeout = (): void => {
    const timeout = operationTimeout.current;

    timeout && clearTimeout(timeout);
  };

  const [useStore] = React.useState(() =>
    create<MindmapsCreatorProviderContext>((set, get) => ({
      nodes: [],
      edges: [],
      operation: `idle`,
      onNodesChange: (changes) => {
        set({
          nodes: applyNodeChanges(
            changes,
            get().nodes as Node[],
          ) as MindmapNode[],
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
      setOperation: (operation, delay = 0) => {
        clearOperationTimeout();

        if (delay === 0) {
          set({ operation });
          return;
        }

        operationTimeout.current = setTimeout(() => {
          set({ operation });
        }, delay);
      },
    })),
  );

  const store = useStore(useShallow(selector));

  React.useEffect(() => {
    return () => {
      clearOperationTimeout();
    };
  }, []);

  return <Context.Provider value={store}>{children}</Context.Provider>;
};
const useMindmapsCreatorCtx = (): MindmapsCreatorProviderContext => {
  const ctx = React.useContext(Context);

  if (!ctx) throw Error(`Lack of provider`);

  return ctx;
};

export { MindmapsCreatorProvider, useMindmapsCreatorCtx };
