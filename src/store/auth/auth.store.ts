import type { User } from 'models/user';
import { create } from 'zustand';

interface AuthorizedData {
  user: User;
  logOut(): void;
}

interface UnauthrorizedData {
  logIn(): void;
}

interface AuthStoreActions {
  authorize(data: AuthorizedData): void;
  unauthorize(data: UnauthrorizedData): void;
}

type AuthStoreStateIdle = { is: 'idle' };
type AuthStoreStateAuthorized = {
  is: 'authorized';
} & AuthorizedData;

type AuthStoreStateUnauthorized = {
  is: 'unauthorized';
} & UnauthrorizedData;

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
  authorize: (data) => {
    set({
      is: `authorized`,
      ...data,
    });
  },
  unauthorize: (data) => {
    set({ is: `unauthorized`, ...data });
  },
};

export { useAuthStore, authStoreActions };
