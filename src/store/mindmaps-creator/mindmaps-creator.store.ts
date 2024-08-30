import { create } from 'zustand';
import type {
  API4MarkdownDto,
  API4MarkdownPayload,
  MindmapDto,
  MindmapEdge,
  MindmapInternalNode,
  MindmapNode,
  MindmapSettingsDto,
} from 'api-4markdown-contracts';
import type { Transaction } from 'development-kit/utility-types';
import { parseErrorV2, type ParsedError } from 'development-kit/parse-error-v2';
import { mock } from 'development-kit/mock';
import {
  applyEdgeChanges,
  applyNodeChanges,
  type EdgeChange,
  type NodeChange,
  type Connection,
} from '@xyflow/react';

type MindmapsCreatorStoreState = Transaction<
  {
    mindmap: Omit<MindmapDto, 'nodes'> & {
      nodes: (MindmapDto['nodes'][number] & { selected?: boolean })[];
    };
    edges: Omit<MindmapDto, 'edges'> & {
      nodes: (MindmapDto['edges'][number] & { selected?: boolean })[];
    };
    settings: MindmapSettingsDto;
  },
  { error: ParsedError }
> & {
  settingsOpened?: boolean;
  nodeFormOpened?: boolean;
  nodeToEditId?: MindmapNode['id'];
  removalConfirmationOpened?: boolean;
};

type MindmapsCreatorStoreOkState = Extract<
  MindmapsCreatorStoreState,
  { is: `ok` }
>;

const isOkState = (
  state: MindmapsCreatorStoreState,
): MindmapsCreatorStoreOkState => {
  if (state.is !== `ok`) throw Error(`State is not ready to work with`);

  return state;
};

const getSelectedNodes = (
  nodes: MindmapsCreatorStoreOkState['mindmap']['nodes'],
): MindmapsCreatorStoreOkState['mindmap']['nodes'] =>
  nodes.filter(({ selected }) => selected);

const useMindmapsCreatorStore = create<MindmapsCreatorStoreState>(() => ({
  is: `idle`,
}));

const { getState: get, setState: set } = useMindmapsCreatorStore;

const mindmapsCreatorStoreSelectors = {
  useState: (): MindmapsCreatorStoreState => useMindmapsCreatorStore(),
  state: (): MindmapsCreatorStoreState => useMindmapsCreatorStore.getState(),
  ok: (): MindmapsCreatorStoreOkState => isOkState(get()),
  useInternalNodeToEdit: (): MindmapNode | undefined =>
    useMindmapsCreatorStore((state) => {
      const { mindmap, nodeToEditId } = isOkState(state);

      if (nodeToEditId === undefined) return undefined;

      return mindmap.nodes.find(({ id }) => id === nodeToEditId);
    }),
  useOk: (): MindmapsCreatorStoreOkState => useMindmapsCreatorStore(isOkState),
  selectedNodes: (): MindmapsCreatorStoreOkState['mindmap']['nodes'] =>
    getSelectedNodes(isOkState(get()).mindmap.nodes),
  useSelectedNodes: (): MindmapsCreatorStoreOkState['mindmap']['nodes'] =>
    useMindmapsCreatorStore((state) =>
      getSelectedNodes(isOkState(state).mindmap.nodes),
    ),
} as const;

const mindmapsCreatorStoreActions = {
  load: async (): Promise<void> => {
    const state = mindmapsCreatorStoreSelectors.state();

    if (state.is === `ok`) return;

    try {
      const searchParams = new URLSearchParams(window.location.search);
      const id = searchParams.get(`id`) ?? ``;

      set({ is: `busy` });

      const { settings, mindmap } = await mock({ delay: 1 })<
        API4MarkdownDto<'getMindmap'>
      >({
        mindmap: {
          id: `1`,
          cdate: ``,
          mdate: ``,
          nodes: [],
          edges: [],
          description: ``,
          name: `React Roadmap`,
          orientation: `y`,
        },
        settings: {
          autoFit: false,
        },
      })<API4MarkdownPayload<'getMindmap'>>({ id });

      set({ is: `ok`, settings, mindmap });
    } catch (error: unknown) {
      set({ is: `fail`, error: parseErrorV2(error) });
    }
  },
  connectNodes: ({ source, target }: Connection): void => {
    const { mindmap } = mindmapsCreatorStoreSelectors.ok();

    set({
      mindmap: {
        ...mindmap,
        edges: [
          ...mindmap.edges,
          {
            id: new Date().toISOString(),
            type: `curved`,
            source,
            target,
          },
        ],
      },
    });
  },
  toggleOrientation: (): void => {
    const { mindmap } = mindmapsCreatorStoreSelectors.ok();

    set({
      mindmap: {
        ...mindmap,
        orientation: mindmap.orientation === `x` ? `y` : `x`,
      },
    });
  },
  toggleAutoFit: (): void => {
    const { settings } = mindmapsCreatorStoreSelectors.ok();

    set({
      settings: {
        ...settings,
        autoFit: !settings.autoFit,
      },
    });
  },
  closeSettings: (): void => {
    set({ settingsOpened: false });
  },
  openSettings: (): void => {
    set({ settingsOpened: true });
  },
  startAddingNode: (): void => {
    set({ nodeFormOpened: true });
  },
  cancelAddingNode: (): void => {
    set({ nodeFormOpened: false, nodeToEditId: undefined });
  },
  addInternalNode: (data: MindmapInternalNode['data']): void => {
    const { mindmap } = mindmapsCreatorStoreSelectors.ok();

    set({
      mindmap: {
        ...mindmap,
        nodes: [
          ...mindmap.nodes,
          {
            // @TODO[PRIO=5]: [Create a function for random ID generation].
            id: new Date().toISOString(),
            position: {
              x: 0,
              y: 0,
            },
            data,
            type: `internal`,
          },
        ],
      },
      nodeFormOpened: false,
    });
  },
  removeNodesConnection: (id: MindmapEdge['id']): void => {
    const { mindmap } = mindmapsCreatorStoreSelectors.ok();

    set({
      mindmap: {
        ...mindmap,
        edges: mindmap.edges.filter((edge) => edge.id !== id),
      },
    });
  },
  updateEdges: (changes: EdgeChange[]): void => {
    const { mindmap } = mindmapsCreatorStoreSelectors.ok();

    set({
      mindmap: {
        ...mindmap,
        edges: applyEdgeChanges(changes, mindmap.edges) as MindmapEdge[],
      },
    });
  },
  updateNodes: (changes: NodeChange[]): void => {
    const { mindmap } = mindmapsCreatorStoreSelectors.ok();

    set({
      mindmap: {
        ...mindmap,
        nodes: applyNodeChanges(changes, mindmap.nodes) as MindmapNode[],
      },
    });
  },
  startNodesRemoval: (): void => {
    set({
      removalConfirmationOpened: true,
    });
  },
  cancelNodesRemoval: (): void => {
    set({
      removalConfirmationOpened: false,
    });
  },
  removeSelectedNodes: (): void => {
    const { mindmap } = mindmapsCreatorStoreSelectors.ok();

    const nodesToRemove = getSelectedNodes(mindmap.nodes).reduce<
      Record<MindmapNode['id'], boolean>
    >((acc, node) => {
      acc[node.id] = true;
      return acc;
    }, {});

    set({
      mindmap: {
        ...mindmap,
        nodes: mindmap.nodes.filter(({ id }) => !nodesToRemove[id]),
        edges: mindmap.edges.filter(
          (edge) => !nodesToRemove[edge.source] && !nodesToRemove[edge.target],
        ),
      },
      removalConfirmationOpened: false,
    });
  },
  beginNodeEdition: (id: MindmapNode['id']): void => {
    set({
      nodeToEditId: id,
      nodeFormOpened: true,
    });
  },
  editInternalNode: (
    id: MindmapNode['id'],
    data: MindmapInternalNode['data'],
  ): void => {
    const { mindmap } = mindmapsCreatorStoreSelectors.ok();

    set({
      nodeToEditId: undefined,
      nodeFormOpened: false,
      mindmap: {
        ...mindmap,
        nodes: mindmap.nodes.map((node) =>
          node.id === id ? { ...node, data } : node,
        ),
      },
    });
  },
} as const;

export type { MindmapsCreatorStoreState };
export {
  useMindmapsCreatorStore,
  mindmapsCreatorStoreSelectors,
  mindmapsCreatorStoreActions,
};
