import type { MindmapCreatorState } from './models';

const selectedNodesSelector = (
  state: MindmapCreatorState,
): MindmapCreatorState['nodes'] => state.nodes.filter((node) => node.selected);

export { selectedNodesSelector };
