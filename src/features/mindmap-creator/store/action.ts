import { suid } from 'development-kit/suid';
import { useMindmapCreatorStore } from '.';
import type { MindmapCreatorEmbeddedNode } from './models';

const { get, set } = useMindmapCreatorStore;

const addNewEmbeddedNode = (data: MindmapCreatorEmbeddedNode['data']): void => {
  const { nodes } = get();

  set({
    nodes: [
      ...nodes,
      {
        id: suid(),
        position: {
          x: 0,
          y: 0,
        },
        selected: true,
        data,
        type: `embedded`,
      },
    ],
  });
};

export { addNewEmbeddedNode };
