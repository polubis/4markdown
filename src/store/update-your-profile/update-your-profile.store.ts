import { parseError } from 'development-kit/parse-error';
import type { Transaction } from 'development-kit/utility-types';
import { create } from 'zustand';

type UpdateYourProfileStoreState = Transaction;

const useUpdateYourProfileStore = create<UpdateYourProfileStoreState>(() => ({
  is: `idle`,
}));

const { setState, getState } = useUpdateYourProfileStore;

const set = (state: UpdateYourProfileStoreState): void => {
  setState(state, true);
};

const updateYourProfileStoreActions = {
  idle: () => set({ is: `idle` }),
  busy: () => set({ is: `busy` }),
  ok: () => set({ is: `ok` }),
  fail: (error: unknown) => set({ is: `fail`, error: parseError(error) }),
};

const updateYourProfileStoreSelectors = {
  state: getState,
  useState: () => useUpdateYourProfileStore(),
};

export { updateYourProfileStoreActions, updateYourProfileStoreSelectors };
