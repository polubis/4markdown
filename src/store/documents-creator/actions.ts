import type { DocumentsCreatorState } from './models';
import { useDocumentsCreatorState } from '.';

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

export { divideDisplay, setCode, setDisplay };
