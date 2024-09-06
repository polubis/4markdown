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

type MindmapCreatorStoreState = Transaction<
  {
    mindmap: Omit<MindmapDto, 'nodes'> & {
      nodes: (MindmapDto['nodes'][number] & {
        selected?: boolean;
        measured?: { width: number; height: number };
      })[];
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

type MindmapCreatorStoreOkState = Extract<
  MindmapCreatorStoreState,
  { is: `ok` }
>;

const isOkState = (
  state: MindmapCreatorStoreState,
): MindmapCreatorStoreOkState => {
  if (state.is !== `ok`) throw Error(`State is not ready to work with`);

  return state;
};

const getSelectedNodes = (
  nodes: MindmapCreatorStoreOkState['mindmap']['nodes'],
): MindmapCreatorStoreOkState['mindmap']['nodes'] =>
  nodes.filter(({ selected }) => selected);

const useMindmapCreatorStore = create<MindmapCreatorStoreState>(() => ({
  is: `idle`,
  saving: { is: `idle` },
}));

const { getState: get, setState: set } = useMindmapCreatorStore;

const mindmapCreatorStoreSelectors = {
  useState: (): MindmapCreatorStoreState => useMindmapCreatorStore(),
  state: (): MindmapCreatorStoreState => useMindmapCreatorStore.getState(),
  ok: (): MindmapCreatorStoreOkState => isOkState(get()),
  useNodeToEdit: ():
    | MindmapCreatorStoreOkState['mindmap']['nodes'][number]
    | undefined =>
    useMindmapCreatorStore((state) => {
      const { mindmap, nodeToEditId } = isOkState(state);

      if (nodeToEditId === undefined) return undefined;

      return mindmap.nodes.find(({ id }) => id === nodeToEditId);
    }),
  useInternalNodeToEdit: (): MindmapInternalNode | undefined =>
    useMindmapCreatorStore((state) => {
      const { mindmap, nodeToEditId } = isOkState(state);

      if (nodeToEditId === undefined) return undefined;

      const foundNode = mindmap.nodes.find(({ id }) => id === nodeToEditId);

      if (foundNode?.type !== `internal`) {
        return undefined;
      }

      return foundNode;
    }),
  useExternalNodeToEdit: (): MindmapExternalNode | undefined =>
    useMindmapCreatorStore((state) => {
      const { mindmap, nodeToEditId } = isOkState(state);

      if (nodeToEditId === undefined) return undefined;

      const foundNode = mindmap.nodes.find(({ id }) => id === nodeToEditId);

      if (foundNode?.type !== `external`) {
        return undefined;
      }

      return foundNode;
    }),
  useOk: (): MindmapCreatorStoreOkState => useMindmapCreatorStore(isOkState),
  selectedNodes: (): MindmapCreatorStoreOkState['mindmap']['nodes'] =>
    getSelectedNodes(isOkState(get()).mindmap.nodes),
  useSelectedNodes: (): MindmapCreatorStoreOkState['mindmap']['nodes'] =>
    useMindmapCreatorStore((state) =>
      getSelectedNodes(isOkState(state).mindmap.nodes),
    ),
} as const;

const mindmapCreatorStoreActions = {
  save: async (): Promise<void> => {
    const { mindmap, saving } = mindmapCreatorStoreSelectors.ok();

    if (saving.is === `busy`) return;

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
          autoFit: true,
        },
      })<API4MarkdownPayload<'getMindmap'>>({ id });

      set({ is: `ok`, settings, mindmap });
    } catch (error: unknown) {
      set({ is: `fail`, error: parseErrorV2(error) });
    }
  },
  connectNodes: ({ source, target }: Connection): void => {
    const { mindmap } = mindmapCreatorStoreSelectors.ok();

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
    const { mindmap, saving } = mindmapCreatorStoreSelectors.ok();

    if (saving.is === `busy`) return;

    set({
      mindmap: {
        ...mindmap,
        orientation: mindmap.orientation === `x` ? `y` : `x`,
      },
    });

    mindmapCreatorStoreActions.alignNodes();
  },
  toggleAutoFit: (): void => {
    const { settings } = mindmapCreatorStoreSelectors.ok();

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
    const { saving } = mindmapCreatorStoreSelectors.ok();

    if (saving.is === `busy`) return;

    set({ settingsOpened: true });
  },
  startAddingNode: (): void => {
    const { saving } = mindmapCreatorStoreSelectors.ok();

    if (saving.is === `busy`) return;

    set({ nodeFormOpened: true });
  },
  cancelAddingNode: (): void => {
    set({ nodeFormOpened: false, nodeToEditId: undefined });
  },
  addInternalNode: (data: MindmapInternalNode['data']): void => {
    const { mindmap } = mindmapCreatorStoreSelectors.ok();

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
    const { mindmap } = mindmapCreatorStoreSelectors.ok();

    set({
      mindmap: {
        ...mindmap,
        edges: mindmap.edges.filter((edge) => edge.id !== id),
      },
    });
  },
  updateEdges: (changes: EdgeChange[]): void => {
    const { mindmap } = mindmapCreatorStoreSelectors.ok();

    set({
      mindmap: {
        ...mindmap,
        edges: applyEdgeChanges(changes, mindmap.edges) as MindmapEdge[],
      },
    });
  },
  updateNodes: (changes: NodeChange[]): void => {
    const { mindmap } = mindmapCreatorStoreSelectors.ok();

    set({
      mindmap: {
        ...mindmap,
        nodes: applyNodeChanges(changes, mindmap.nodes) as MindmapNode[],
      },
    });
  },
  startNodesRemoval: (): void => {
    const { saving } = mindmapCreatorStoreSelectors.ok();

    if (saving.is === `busy`) return;

    const selectedNodes = mindmapCreatorStoreSelectors.selectedNodes();

    if (selectedNodes.length === 0) return;

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
    const { mindmap } = mindmapCreatorStoreSelectors.ok();

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
  beginNodeEdition: (): void => {
    const { saving } = mindmapCreatorStoreSelectors.ok();

    if (saving.is === `busy`) return;

    const selectedNodes = mindmapCreatorStoreSelectors.selectedNodes();

    if (selectedNodes.length !== 1) return;

    set({
      nodeToEditId: selectedNodes[0].id,
      nodeFormOpened: true,
    });
  },
  editInternalNode: (
    id: MindmapNode['id'],
    data: MindmapInternalNode['data'],
  ): void => {
    const { mindmap } = mindmapCreatorStoreSelectors.ok();

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
    const { mindmap } = mindmapCreatorStoreSelectors.ok();

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
    const { mindmap } = mindmapCreatorStoreSelectors.ok();

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
    const { saving } = mindmapCreatorStoreSelectors.ok();

    if (saving.is === `busy`) return;

    try {
      const { getLayoutedElements } = await import(`./get-layouted-elements`);

      const { mindmap } = mindmapCreatorStoreSelectors.ok();

      set({
        mindmap: {
          ...mindmap,
          ...getLayoutedElements(),
        },
      });
    } catch {}
  },
} as const;

export type { MindmapCreatorStoreState, MindmapCreatorStoreOkState };
export {
  useMindmapCreatorStore,
  mindmapCreatorStoreSelectors,
  mindmapCreatorStoreActions,
};
