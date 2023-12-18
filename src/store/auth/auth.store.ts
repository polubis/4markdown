import type { Doc } from 'models/doc';
import type { User } from 'models/user';
import { create } from 'zustand';

interface AuthorizedData {
  user: User;
  logOut(): void;
  createDoc(name: Doc['name']): Promise<void>;
  updateDoc(name: Doc['name']): Promise<void>;
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

interface AuthStoreSelectors {
  authorized(): AuthStoreStateAuthorized;
}

const useAuthStore = create<AuthStoreState>(() => ({
  is: `idle`,
}));

const { setState, getState } = useAuthStore;

const authStoreSelectors: AuthStoreSelectors = {
  authorized: () => {
    const state = getState();

    if (state.is !== `authorized`)
      throw Error(`Tried to access authorized only state`);

    return state;
  },
};

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

export { useAuthStore, authStoreActions, authStoreSelectors };
