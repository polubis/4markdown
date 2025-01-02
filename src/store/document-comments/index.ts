import { state } from 'development-kit/state';
import type { DocumentCommentsState } from './models';

const useDocumentCommentsState = state<DocumentCommentsState>({
  comments: { is: `idle` },
  updating: { is: `idle` },
});

export { useDocumentCommentsState };
