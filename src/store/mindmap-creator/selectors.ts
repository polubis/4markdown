import type { MindmapDto } from 'api-4markdown-contracts';
import type { MindmapCreatorState } from './models';
import { falsy } from 'development-kit/guards';

const selectedNodesSelector = (
  state: MindmapCreatorState,
): MindmapCreatorState['nodes'] => state.nodes.filter((node) => node.selected);

const readyMindmapsSelector = (
  mindmaps: MindmapCreatorState['mindmaps'],
): Extract<MindmapCreatorState['mindmaps'], { is: `ok` }> => {
  falsy(
    mindmaps.is === `ok`,
    `Invalid reading attempt in mindmap creator state`,
  );

  return mindmaps;
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

const openedNodeFormSelector = (
  nodeForm: MindmapCreatorState['nodeForm'],
): Exclude<MindmapCreatorState['nodeForm'], { is: `closed` }> => {
  if (nodeForm.is === `closed`)
    throw Error(`Invalid reading attempt in node form`);

  return nodeForm;
};

export {
  selectedNodesSelector,
  readyMindmapsSelector,
  activeMindmapSelector,
  safeActiveMindmapSelector,
  openedNodeFormSelector,
};
