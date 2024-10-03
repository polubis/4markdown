import type { DocumentPreviewStoreState } from './document-preview.models';

const selectSafe = (
  state: DocumentPreviewStoreState,
): Extract<DocumentPreviewStoreState, { is: `ok` }> => {
  if (state.is === `ok`) return state;

  throw Error(`State read attempt when in invalid state`);
};

export { selectSafe };
