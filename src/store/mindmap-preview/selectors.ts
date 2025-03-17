import type { MindmapPreviewState } from './models';

const readyMindmapPreviewSelector = (
  state: MindmapPreviewState,
): Extract<MindmapPreviewState, { is: `ok` }> => {
  if (state.is === `ok`) return state;

  throw Error(`Invalid reading attempt in mindmap preview state`);
};

export { readyMindmapPreviewSelector };
