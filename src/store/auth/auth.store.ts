import type { Auth } from 'firebase/auth';
import { create } from 'zustand';

interface AuthorizedUser {
  name: string | null;
  avatar: string | null;
}

interface AuthStoreActions {
  reset(): void;
  authorize(user: AuthorizedUser, auth: Auth): void;
  unauthorize(auth: Auth): void;
}

type AuthStoreStateIdle = { is: 'idle' };
type AuthStoreStateAuthorized = {
  is: 'authorized';
  user: AuthorizedUser;
  auth: Auth;
};

type AuthStoreStateUnauthorized = { is: 'unauthorized'; auth: Auth };

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
  authorize: (user, auth) => set({ is: `authorized`, user, auth }),
  unauthorize: (auth) => set({ is: `unauthorized`, auth }),
};

export { useAuthStore, authStoreActions };
