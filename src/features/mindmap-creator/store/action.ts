import { suid } from 'development-kit/suid';
import { useMindmapCreatorStore } from '.';
import type {
  MindmapCreatorEmbeddedNode,
  MindmapCreatorExternalNode,
} from './models';

const { get, set } = useMindmapCreatorStore;

const addNewEmbeddedNodeAction = (
  data: MindmapCreatorEmbeddedNode['data'],
): void => {
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

const addNewExternalNodeAction = (
  data: MindmapCreatorExternalNode['data'],
): void => {
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
        type: `external`,
      },
    ],
  });
};

export { addNewEmbeddedNodeAction, addNewExternalNodeAction };
