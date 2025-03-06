import type { MindmapDto } from 'api-4markdown-contracts';
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

const activeMindmapSelector = (
  state: MindmapCreatorState,
): MindmapDto | null => {
  if (state.activeMindmapId === null || state.mindmaps.is !== `ok`) return null;

  return (
    state.mindmaps.data.find(
      (mindmap) => mindmap.id === state.activeMindmapId,
    ) ?? null
  );
};

const safeActiveMindmapSelector = (state: MindmapCreatorState): MindmapDto => {
  const mindmap = activeMindmapSelector(state);

  if (!mindmap) throw Error(`Invalid reading attempt. Cannot find mindmap`);

  return mindmap;
};

export {
  selectedNodesSelector,
  readyMindmapsSelector,
  activeMindmapSelector,
  safeActiveMindmapSelector,
};
