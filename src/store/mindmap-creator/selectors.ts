import type { MindmapCreatorState } from './models';

const selectedNodesSelector = (
  state: MindmapCreatorState,
): MindmapCreatorState['nodes'] => state.nodes.filter((node) => node.selected);

const readyMindmapsSelector = (state: MindmapCreatorState) => {
  if (state.mindmaps.is === `ok`) return state;

  throw Error(`Invalid reading attempt in mindmap creator state`);
};

export { selectedNodesSelector, readyMindmapsSelector };
