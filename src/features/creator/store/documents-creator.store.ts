import { create } from 'zustand';
import type { DocumentsCreatorState } from './documents-creator.store-models';

const useDocumentsCreatorState = create<DocumentsCreatorState>(() => ({
  documents: [],
  activeDocumentId: null,
  initialCode: ``,
  code: ``,
  changed: false,
  display: `both`,
  busy: false,
  error: null,
}));

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

export { useDocumentsCreatorState, setCode, setDisplay, divideDisplay };
