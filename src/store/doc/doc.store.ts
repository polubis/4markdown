import type { API4MarkdownDto } from "api-4markdown-contracts";
import type { Atoms } from "api-4markdown-contracts";
import {
  changeAction,
  markAsUnchangedAction,
} from "store/document-creator/actions";
import { addOrBumpEntryAction } from "modules/previous-work";
import { create } from "zustand";

interface DocStoreIdleState {
  is: "idle";
}

type DocStoreActiveState = API4MarkdownDto<`getYourDocuments`>[number] & {
  is: "active";
};

type DocStoreState = DocStoreIdleState | DocStoreActiveState;

const useDocStore = create<DocStoreState>(() => ({
  is: `idle`,
}));

const { setState } = useDocStore;

const set = (state: DocStoreState) => {
  setState(state, true);
};

const getActiveState = (state: DocStoreState): DocStoreActiveState => {
  if (state.is === `idle`) throw Error(`Tried to read in not allowed state`);

  return state;
};

const docStoreSelectors = {
  active: () => getActiveState(useDocStore.getState()),
  useActive: () => useDocStore(getActiveState),
  state: () => useDocStore.getState(),
  useState: () => useDocStore(),
};

const recordDocumentInPreviousWork = (
  doc: API4MarkdownDto<`getYourDocuments`>[number],
) => {
  addOrBumpEntryAction({
    type: `document`,
    resourceId: doc.id as Atoms["DocumentId"],
    title: doc.name,
    lastTouched: Date.now(),
  });
};

const docStoreActions = {
  setActiveWithoutCodeChange: (
    doc: API4MarkdownDto<`getYourDocuments`>[number],
  ) => {
    set({
      is: `active`,
      ...doc,
    });
    recordDocumentInPreviousWork(doc);
  },
  setActive: (
    doc: API4MarkdownDto<`getYourDocuments`>[number],
    asUnchanged = true,
  ) => {
    set({
      is: `active`,
      ...doc,
    });
    changeAction(doc.code);
    asUnchanged && markAsUnchangedAction();
    recordDocumentInPreviousWork(doc);
  },
  reset: () => set({ is: `idle` }),
};

export type { DocStoreState, DocStoreActiveState };
export { useDocStore, docStoreActions, docStoreSelectors };
