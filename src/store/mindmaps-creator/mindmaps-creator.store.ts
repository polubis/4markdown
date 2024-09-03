import { create } from 'zustand';
import type {
  API4MarkdownDto,
  API4MarkdownPayload,
  MindmapDto,
  MindmapEdge,
  MindmapExternalNode,
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
import * as mocks from './mock';

type MindmapsCreatorStoreState = Transaction<
  {
    mindmap: Omit<MindmapDto, 'nodes'> & {
      nodes: (MindmapDto['nodes'][number] & {
        selected?: boolean;
        measured?: { width: number; height: number };
      })[];
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
  saving: Transaction<undefined, { error: ParsedError }>;
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
  saving: { is: `idle` },
}));

const { getState: get, setState: set } = useMindmapsCreatorStore;

const mindmapsCreatorStoreSelectors = {
  useState: (): MindmapsCreatorStoreState => useMindmapsCreatorStore(),
  state: (): MindmapsCreatorStoreState => useMindmapsCreatorStore.getState(),
  ok: (): MindmapsCreatorStoreOkState => isOkState(get()),
  useInternalNodeToEdit: (): MindmapInternalNode | undefined =>
    useMindmapsCreatorStore((state) => {
      const { mindmap, nodeToEditId } = isOkState(state);

      if (nodeToEditId === undefined) return undefined;

      const foundNode = mindmap.nodes.find(({ id }) => id === nodeToEditId);

      if (foundNode?.type !== `internal`) {
        return undefined;
      }

      return foundNode;
    }),
  useExternalNodeToEdit: (): MindmapExternalNode | undefined =>
    useMindmapsCreatorStore((state) => {
      const { mindmap, nodeToEditId } = isOkState(state);

      if (nodeToEditId === undefined) return undefined;

      const foundNode = mindmap.nodes.find(({ id }) => id === nodeToEditId);

      if (foundNode?.type !== `external`) {
        return undefined;
      }

      return foundNode;
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
  save: async (): Promise<void> => {
    const { mindmap } = mindmapsCreatorStoreSelectors.ok();

    try {
      set({ saving: { is: `busy` } });

      const { mdate } = await mock({ delay: 1 })<
        API4MarkdownDto<'updateMindmap'>
      >({
        mdate: new Date().toISOString(),
      })<API4MarkdownPayload<'updateMindmap'>>({ mindmap });

      set({
        saving: { is: `ok` },
        mindmap: {
          ...mindmap,
          mdate,
        },
      });
    } catch (error: unknown) {
      set({ saving: { is: `fail`, error: parseErrorV2(error) } });
    }
  },
  load: async (): Promise<void> => {
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
          nodes: mocks.nodes,
          edges: mocks.edges,
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
    const { saving } = mindmapsCreatorStoreSelectors.ok();

    if (saving.is === `busy`) return;

    set({ settingsOpened: true });
  },
  startAddingNode: (): void => {
    const { saving } = mindmapsCreatorStoreSelectors.ok();

    if (saving.is === `busy`) return;

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
            selected: true,
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
    const { saving } = mindmapsCreatorStoreSelectors.ok();

    if (saving.is === `busy`) return;

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
    const { saving } = mindmapsCreatorStoreSelectors.ok();

    if (saving.is === `busy`) return;

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
          node.id === id && node.type === `internal` ? { ...node, data } : node,
        ),
      },
    });
  },
  addExternalNode: (data: MindmapExternalNode['data']): void => {
    const { mindmap } = mindmapsCreatorStoreSelectors.ok();

    set({
      nodeToEditId: undefined,
      nodeFormOpened: false,
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
            type: `external`,
            selected: true,
          },
        ],
      },
    });
  },
  editExternalNode: (
    id: MindmapNode['id'],
    data: MindmapExternalNode['data'],
  ): void => {
    const { mindmap } = mindmapsCreatorStoreSelectors.ok();

    set({
      nodeToEditId: undefined,
      nodeFormOpened: false,
      mindmap: {
        ...mindmap,
        nodes: mindmap.nodes.map((node) =>
          node.id === id && node.type === `external` ? { ...node, data } : node,
        ),
      },
    });
  },
  alignNodes: async () => {
    try {
      const { getLayoutedElements } = await import(`./get-layouted-elements`);

      const { mindmap } = mindmapsCreatorStoreSelectors.ok();

      set({
        mindmap: {
          ...mindmap,
          ...getLayoutedElements(),
        },
      });

      getLayoutedElements();
    } catch {}
  },
} as const;

export type { MindmapsCreatorStoreState, MindmapsCreatorStoreOkState };
export {
  useMindmapsCreatorStore,
  mindmapsCreatorStoreSelectors,
  mindmapsCreatorStoreActions,
};
