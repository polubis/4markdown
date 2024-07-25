import { parseError } from 'development-kit/parse-error';
import type { Transaction } from 'development-kit/transaction';
import type { UpdateYourProfileDto } from 'models/user';
import { yourProfileStoreActions } from 'store/your-profile/your-profile.store';
import { create } from 'zustand';

type UpdateYourProfileStoreState = Transaction;

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
  ok: (dto: UpdateYourProfileDto) => {
    set({ is: `ok` });
    yourProfileStoreActions.ok(dto);
  },
  fail: (error: unknown) => set({ is: `fail`, error: parseError(error) }),
};

const updateYourProfileStoreSelectors = {
  state: getState,
  useState: () => useUpdateYourProfileStore(),
};

export { updateYourProfileStoreActions, updateYourProfileStoreSelectors };
