import type { Date, UserProfileDto } from 'api-4markdown-contracts';
import { parseError } from 'development-kit/parse-error';
import type { Transaction } from 'development-kit/utility-types';
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
  ok: (mdate: Date, dto: UserProfileDto) => {
    set({ is: `ok` });
    yourProfileStoreActions.ok(mdate, dto);
  },
  fail: (error: unknown) => set({ is: `fail`, error: parseError(error) }),
};

const updateYourProfileStoreSelectors = {
  state: getState,
  useState: () => useUpdateYourProfileStore(),
};

export { updateYourProfileStoreActions, updateYourProfileStoreSelectors };
