import { parseError } from 'development-kit/parse-error';
import type { Transaction } from 'models/transaction';
import { UpdateYourProfileDto } from 'models/user';
import { create } from 'zustand';

type UpdateYourProfileStoreState = Transaction<UpdateYourProfileDto>;

const useUpdateYourProfileStore = create<UpdateYourProfileStoreState>(() => ({
  is: `idle`,
}));

const { setState, getState } = useUpdateYourProfileStore;

const set = (state: UpdateYourProfileStoreState, replace = true): void => {
  setState(state, replace);
};

const updateYourProfileStoreActions = {
  idle: () => set({ is: `idle` }),
  busy: () => set({ is: `busy` }),
  ok: (data: UpdateYourProfileDto) => set({ is: `ok`, ...data }),
  fail: (error: unknown) => set({ is: `fail`, error: parseError(error) }),
};

const updateYourProfileStoreSelectors = {
  state: getState,
  useState: () => useUpdateYourProfileStore(),
};

export { updateYourProfileStoreActions, updateYourProfileStoreSelectors };
