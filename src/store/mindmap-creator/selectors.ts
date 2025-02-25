import type { MindmapCreatorState } from './models';

const selectedNodesSelector = (
  state: MindmapCreatorState,
): MindmapCreatorState['nodes'] => state.nodes.filter((node) => node.selected);

const readyMindmapsSelector = (
  mindmaps: MindmapCreatorState['mindmaps'],
): Extract<MindmapCreatorState['mindmaps'], { is: `ok` }> => {
  if (mindmaps.is === `ok`) return mindmaps;

  throw Error(`Invalid reading attempt in mindmap creator state`);
};

export { selectedNodesSelector, readyMindmapsSelector };
