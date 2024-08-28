import { create } from 'zustand';
import type {
  API4MarkdownDto,
  API4MarkdownPayload,
} from 'api-4markdown-contracts';
import type { Transaction } from 'development-kit/utility-types';
import type { ParsedError } from 'development-kit/parse-error-v2';
import { mock } from 'development-kit/mock';

type MindmapsCreatorStoreState = Transaction<
  API4MarkdownDto<'getMindmap'>,
  ParsedError
> & {
  settingsOpened: boolean;
  nodeFormOpened: boolean;
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

const useMindmapsCreatorStore = create<MindmapsCreatorStoreState>(() => ({
  is: `idle`,
  nodeFormOpened: false,
  settingsOpened: false,
}));

const { getState: get, setState: set } = useMindmapsCreatorStore;

const getOkState = (): MindmapsCreatorStoreOkState => isOkState(get());

const mindmapsCreatorStoreSelectors = {
  ok: getOkState,
  useOk: (): MindmapsCreatorStoreOkState => useMindmapsCreatorStore(isOkState),
} as const;

const mindmapsCreatorStoreActions = {
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
          nodes: [],
          edges: [],
          description: ``,
          name: `React Roadmap`,
        },
        settings: {
          autoFit: false,
        },
      })<API4MarkdownPayload<'getMindmap'>>({ id });

      set({ is: `ok`, settings, mindmap });
    } catch (error: unknown) {}
  },
} as const;

export type { MindmapsCreatorStoreState };
export {
  useMindmapsCreatorStore,
  mindmapsCreatorStoreSelectors,
  mindmapsCreatorStoreActions,
};

// settings: {
//   opened: false,
//   autoFit: false,
// },
// nodeForm: {
//   opened: false,
// },
// mindmap: {
//   id: `1`,
//   cdate: ``,
//   mdate: ``,
//   nodes: [],
//   edges: [],
//   description: ``,
//   name: `React Roadmap`,
// },
