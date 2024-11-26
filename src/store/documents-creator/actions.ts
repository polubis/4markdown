import type { DocumentsCreatorState } from './models';
import { useDocumentsCreatorState } from '.';
import type { AsyncResult } from 'development-kit/utility-types';
import { parseError } from 'api-4markdown';

const { setState: set, getState: get } = useDocumentsCreatorState;

const setCode = (code: DocumentsCreatorState['code']): void => {
  set({ code });
};

const setDisplay = (display: DocumentsCreatorState['display']): void => {
  set({ display });
};

const divideDisplay = (): void => {
  const { display } = get();

  if (display === `both`) {
    setDisplay(`code`);
    return;
  }

  if (display === `code`) {
    setDisplay(`preview`);
    return;
  }

  setDisplay(`both`);
};

const resetError = (): void => {
  set({ error: null });
};

const setActiveDocumentId = (
  activeDocumentId: DocumentsCreatorState['activeDocumentId'],
): void => {
  set({ activeDocumentId });
};

const asBusy = (): void => {
  set({ busy: true, error: null });
};

const asFail = (
  rawError: unknown,
): Extract<Awaited<AsyncResult>, { is: `fail` }> => {
  const error = parseError(rawError);

  set({ busy: false, error });

  return { is: `fail`, error };
};

export {
  divideDisplay,
  setCode,
  setDisplay,
  resetError,
  setActiveDocumentId,
  asBusy,
  asFail,
};
