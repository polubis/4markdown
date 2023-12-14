import { create } from 'zustand';

interface AuthorizedUser {
  name: string | null;
  avatar: string | null;
}

interface AuthStoreActions {
  reset(): void;
  authorize(user: AuthorizedUser): void;
  unauthorize(): void;
}

type AuthStoreStateIdle = { is: 'idle' };
type AuthStoreStateAuthorized = { is: 'authorized'; user: AuthorizedUser };
type AuthStoreStateUnauthorized = { is: 'unauthorized' };

type AuthStoreState =
  | AuthStoreStateIdle
  | AuthStoreStateAuthorized
  | AuthStoreStateUnauthorized;

const useAuthStore = create<AuthStoreState>(() => ({
  is: `idle`,
}));

const { setState } = useAuthStore;

const set = (state: AuthStoreState): void => {
  setState(state, true);
};

const authStoreActions: AuthStoreActions = {
  reset: () => set({ is: `idle` }),
  authorize: (user) => set({ is: `authorized`, user }),
  unauthorize: () => set({ is: `unauthorized` }),
};

export { useAuthStore, authStoreActions };
