import { state } from 'development-kit/state';
import type { MindmapCreatorStore } from './models';

const useMindmapCreatorStore = state<MindmapCreatorStore>({
  orientation: `y`,
  nodes: [],
  edges: [],
  nodeForm: { is: `closed` },
});

export { useMindmapCreatorStore };
