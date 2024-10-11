import { parseErrorV2 } from 'development-kit/parse-error-v2';
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
  fail: (error: unknown) => set({ is: `fail`, error: parseErrorV2(error) }),
};

const updateYourProfileStoreSelectors = {
  state: getState,
  useState: () => useUpdateYourProfileStore(),
};

export { updateYourProfileStoreActions, updateYourProfileStoreSelectors };
