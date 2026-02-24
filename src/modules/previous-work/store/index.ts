import { state } from "development-kit/state";
import type { PreviousWorkState } from "./models";
import { PREVIOUS_WORK_LS_KEY } from "./config";

const usePreviousWorkState = state<PreviousWorkState>({
  entries: [],
  openRequested: false,
});

const persistEntries = (entries: PreviousWorkState["entries"]): void => {
  if (typeof window === `undefined`) return;
  try {
    window.localStorage.setItem(PREVIOUS_WORK_LS_KEY, JSON.stringify(entries));
  } catch {
    // ignore
  }
};

const loadEntriesFromStorage = (): PreviousWorkState["entries"] => {
  if (typeof window === `undefined`) return [];
  try {
    const raw = window.localStorage.getItem(PREVIOUS_WORK_LS_KEY);
    if (raw === null) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (e): e is PreviousWorkState["entries"][number] =>
        e != null &&
        typeof e === `object` &&
        typeof e.type === `string` &&
        typeof (e as { resourceId?: string }).resourceId === `string` &&
        typeof (e as { title?: string }).title === `string` &&
        typeof (e as { lastTouched?: number }).lastTouched === `number`,
    );
  } catch {
    return [];
  }
};

const clearStorage = (): void => {
  if (typeof window === `undefined`) return;
  try {
    window.localStorage.removeItem(PREVIOUS_WORK_LS_KEY);
  } catch {
    // ignore
  }
};

export {
  usePreviousWorkState,
  persistEntries,
  loadEntriesFromStorage,
  clearStorage,
};
