import { parseError } from 'development-kit/parse-error';
import type { Transaction } from 'models/transaction';
import { create } from 'zustand';

type DocManagementStoreState = Transaction;

const useDocManagementStore = create<DocManagementStoreState>(() => ({
  is: `idle`,
}));

const { setState, getState: get } = useDocManagementStore;

const set = (state: DocManagementStoreState): void => {
  setState(state, true);
};

const docManagementStoreSelectors = {
  useFail: () => {
    const state = get();

    if (state.is !== `fail`) {
      throw Error(`Tried to access state not in fail mode`);
    }

    return state;
  },
} as const;

const docManagementStoreActions = {
  idle: () => set({ is: `idle` }),
  busy: () => set({ is: `busy` }),
  ok: () => set({ is: `ok` }),
  fail: (error: unknown) => set({ is: `fail`, error: parseError(error) }),
} as const;

export {
  useDocManagementStore,
  docManagementStoreActions,
  docManagementStoreSelectors,
};
