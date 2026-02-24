import type { Atoms } from "api-4markdown-contracts";
import {
  usePreviousWorkState,
  persistEntries,
  loadEntriesFromStorage,
  clearStorage,
} from "./store";
import type { PreviousWorkEntry } from "./store/models";
import { PREVIOUS_WORK_MAX_ENTRIES } from "./store/config";

const entryKey = (e: PreviousWorkEntry): string => `${e.type}:${e.resourceId}`;

const addOrBumpEntryAction = (entry: PreviousWorkEntry): void => {
  const key = entryKey(entry);
  const current = usePreviousWorkState.get().entries;
  const rest = current.filter((e) => entryKey(e) !== key);
  const next = [{ ...entry, lastTouched: Date.now() }, ...rest].slice(
    0,
    PREVIOUS_WORK_MAX_ENTRIES,
  );
  usePreviousWorkState.set({ entries: next });
  persistEntries(next);
};

const removeDocumentEntryAction = (documentId: Atoms["DocumentId"]): void => {
  const current = usePreviousWorkState.get().entries;
  const next = current.filter(
    (e) => !(e.type === `document` && e.resourceId === documentId),
  );
  usePreviousWorkState.set({ entries: next });
  persistEntries(next);
};

const removeMindmapEntryAction = (mindmapId: Atoms["MindmapId"]): void => {
  const current = usePreviousWorkState.get().entries;
  const next = current.filter(
    (e) => !(e.type === `mindmap` && e.resourceId === mindmapId),
  );
  usePreviousWorkState.set({ entries: next });
  persistEntries(next);
};

const clearPreviousWorkAction = (): void => {
  usePreviousWorkState.reset();
  clearStorage();
};

const loadPreviousWorkFromStorageAction = (): void => {
  const entries = loadEntriesFromStorage();
  usePreviousWorkState.set({ entries });
};

const requestOpenPreviousWorkAction = (): void => {
  usePreviousWorkState.set({ openRequested: true });
};

const clearOpenRequestAction = (): void => {
  usePreviousWorkState.set({ openRequested: false });
};

export {
  addOrBumpEntryAction,
  removeDocumentEntryAction,
  removeMindmapEntryAction,
  clearPreviousWorkAction,
  loadPreviousWorkFromStorageAction,
  requestOpenPreviousWorkAction,
  clearOpenRequestAction,
};
