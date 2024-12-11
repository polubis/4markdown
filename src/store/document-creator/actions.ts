import { useDocumentCreatorState } from '.';
import { CREATOR_STORE_LS_KEY } from './config';
import type { DocumentCreatorState } from './models';

const setState = (state: Partial<DocumentCreatorState>): void => {
  useDocumentCreatorState.set(state);
  localStorage.setItem(CREATOR_STORE_LS_KEY, JSON.stringify(state));
};

const resetAction = (): void => {
  const { initialCode } = useDocumentCreatorState.get();

  setState({
    code: initialCode,
    initialCode,
    changed: false,
  });
};

const syncAction = (): void => {
  const state = localStorage.getItem(CREATOR_STORE_LS_KEY) as string | null;

  if (state === null) return;

  try {
    useDocumentCreatorState.set(JSON.parse(state));
  } catch {}
};

const markAsUnchangedAction = (): void => {
  const { initialCode, code } = useDocumentCreatorState.get();

  setState({
    code,
    initialCode,
    changed: false,
  });
};

const changeWithoutMarkAsUnchangedAction = (
  code: DocumentCreatorState['code'],
): void => {
  const { initialCode, changed } = useDocumentCreatorState.get();

  setState({
    code,
    initialCode,
    changed,
  });
};

const changeAction = (code: DocumentCreatorState['code']): void => {
  const { initialCode } = useDocumentCreatorState.get();

  setState({
    code,
    initialCode,
    changed: true,
  });
};

export {
  resetAction,
  syncAction,
  markAsUnchangedAction,
  changeWithoutMarkAsUnchangedAction,
  changeAction,
};
