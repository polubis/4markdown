import type { YourMindmapsState, YourMindmapsOkState } from './models';

const yourMindmapsReadySelector = (
  state: YourMindmapsState,
): YourMindmapsOkState => {
  if (state.is === `ok`) return state;

  throw Error(`Invalid state read attempt in mindmap creation`);
};

export { yourMindmapsReadySelector };
