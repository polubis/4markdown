import { parseError } from 'development-kit/parse-error';
import type { Transaction } from 'models/transaction';
import { UpdateUserProfileDto } from 'models/user';
import { create } from 'zustand';

type UpdateUserProfileStoreState = Transaction<UpdateUserProfileDto>;

const useUpdateUserProfileStore = create<UpdateUserProfileStoreState>(() => ({
  is: `idle`,
}));

const { setState, getState } = useUpdateUserProfileStore;

const set = (state: UpdateUserProfileStoreState, replace = true): void => {
  setState(state, replace);
};

const updateUserProfileStoreActions = {
  idle: () => set({ is: `idle` }),
  busy: () => set({ is: `busy` }),
  ok: (data: UpdateUserProfileDto) => set({ is: `ok`, ...data }),
  fail: (error: unknown) => set({ is: `fail`, error: parseError(error) }),
};

const updateUserProfileStoreSelectors = {
  state: getState,
  useState: () => useUpdateUserProfileStore(),
};

export {
  useUpdateUserProfileStore,
  updateUserProfileStoreActions,
  updateUserProfileStoreSelectors,
};
