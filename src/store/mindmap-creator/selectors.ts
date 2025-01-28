import type { MindmapCreatorOkState, MindmapCreatorState } from './models';

const mindmapReadySelector = (
  state: MindmapCreatorState,
): MindmapCreatorOkState => {
  if (state.is === `ok`) return state;

  throw Error(`Invalid state read attempt in mindmap creation`);
};

export { mindmapReadySelector };
