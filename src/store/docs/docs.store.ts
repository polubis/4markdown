import { parseError } from "api-4markdown";
import type { API4MarkdownDto, DocumentDto } from "api-4markdown-contracts";
import type { Transaction } from "development-kit/utility-types";
import { create } from "zustand";
// @TODO[PRIO=2]: [Align type definitions for retrieving documents].
type DocsStoreState = Transaction<{
  docs: API4MarkdownDto<`getYourDocuments`>;
}>;
type DocsStoreOkState = Extract<DocsStoreState, { is: "ok" }>;

const useDocsStore = create<DocsStoreState>(() => ({
  is: `idle`,
}));

const { setState, getState } = useDocsStore;

const set = (state: DocsStoreState) => {
  setState(state, true);
};

const getOkState = (state: DocsStoreState): DocsStoreOkState => {
  if (state.is !== `ok`) throw Error(`Tried to read state when not allowed`);

  return state;
};

const docsStoreSelectors = {
  state: () => getState(),
  ok: () => getOkState(getState()),
};

const docsStoreActions = {
  idle: () => set({ is: `idle` }),
  busy: () => set({ is: `busy` }),
  ok: (docs: API4MarkdownDto<`getYourDocuments`>) => set({ is: `ok`, docs }),
  fail: (error: unknown) => set({ is: `fail`, error: parseError(error) }),
  updateDoc: (doc: API4MarkdownDto<`getYourDocuments`>[number]) => {
    const state = docsStoreSelectors.ok();

    set({
      ...state,
      docs: state.docs
        .map((d) => (d.id === doc.id ? doc : d))
        .sort((prev, curr) => {
          if (prev.mdate > curr.mdate) return -1;
          if (prev.mdate === curr.mdate) return 0;
          return 1;
        }),
    });
  },
  addDoc: (doc: API4MarkdownDto<`getYourDocuments`>[number]) => {
    const state = docsStoreSelectors.ok();

    set({
      ...state,
      docs: [doc, ...state.docs],
    });
  },
  deleteDoc: (id: DocumentDto["id"]) => {
    const state = docsStoreSelectors.ok();

    set({
      ...state,
      docs: state.docs.filter((doc) => doc.id !== id),
    });
  },
};

export type { DocsStoreOkState };
export { useDocsStore, docsStoreActions, docsStoreSelectors };
