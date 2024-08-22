import { create } from 'zustand';
import type { MindmapDto } from 'api-4markdown-contracts';

type MindmapsCreatorStoreState = {
  mindmap: MindmapDto;
};

const useMindmapsCreatorStore = create<MindmapsCreatorStoreState>(() => ({
  mindmap: {
    id: `1`,
    cdate: ``,
    mdate: ``,
    nodes: [],
    edges: [],
    description: ``,
    name: ``,
  },
}));

export { useMindmapsCreatorStore };
