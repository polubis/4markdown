import { create } from 'zustand';
import type { MindmapDto, MindmapNode } from 'api-4markdown-contracts';

type NodeFormData = Pick<MindmapNode, 'type' | 'data'>;

type MindmapsCreatorStoreState = {
  nodeForm:
    | {
        opened: false;
      }
    | ({ opened: true } & NodeFormData);
  mindmap: MindmapDto;
};

const useMindmapsCreatorStore = create<MindmapsCreatorStoreState>(() => ({
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
    name: ``,
  },
}));

export { useMindmapsCreatorStore };
