import type { MindmapCreatorActiveState, MindmapCreatorState } from './models';

const mindmapCreatorReadySelector = (
  state: MindmapCreatorState,
): MindmapCreatorActiveState => {
  if (state.is === `active`) return state;

  throw Error(`Invalid state read attempt in mindmap creation`);
};

export { mindmapCreatorReadySelector };
