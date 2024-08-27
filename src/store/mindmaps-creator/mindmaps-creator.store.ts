import { create } from 'zustand';
import type { MindmapDto, MindmapNode } from 'api-4markdown-contracts';

type NodeFormData = Pick<MindmapNode, 'type' | 'data'>;

type MindmapsCreatorStoreState = {
  settings: {
    opened: boolean;
    autoFit: boolean;
  };
  nodeForm: {
    opened: boolean;
    data?: NodeFormData;
  };
  mindmap: MindmapDto;
};

const useMindmapsCreatorStore = create<MindmapsCreatorStoreState>(() => ({
  settings: {
    opened: false,
    autoFit: false,
  },
  nodeForm: {
    opened: false,
  },
  mindmap: {
    id: `1`,
    cdate: ``,
    mdate: ``,
    nodes: [],
    edges: [],
    description: ``,
    name: `React Roadmap`,
  },
}));

export type { MindmapsCreatorStoreState };
export { useMindmapsCreatorStore };
