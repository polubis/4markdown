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
    nodes: [
      {
        id: `1`,
        position: { x: 0, y: 0 },
        height: null,
        width: null,
        data: {
          url: `https://google.com`,
          name: `Test`,
          description: `dasdasdasdasddasdds`,
        },
        type: `external`,
      },
      {
        id: `2`,
        position: { x: 0, y: 100 },
        height: null,
        width: null,
        data: {
          url: `https://google.com`,
          name: `Test`,
          description: `dasdasdasdasddasdds`,
        },
        type: `external`,
      },
      {
        id: `node-1`,
        position: { x: 0, y: 300 },
        height: null,
        width: null,
        data: {
          url: `https://google.com`,
          name: `Test`,
          description: `dasdasdasdasddasdds`,
        },
        type: `external`,
      },
    ],
    edges: [
      { id: `e1-2`, source: `1`, target: `2` },
      { id: `e1-3`, source: `1`, target: `node-1` },
    ],
    description: `dasds`,
    name: `dassd`,
  },
}));

export { useMindmapsCreatorStore };
