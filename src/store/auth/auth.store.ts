import type { Doc, GetDocPayload, PermanentBlog } from 'models/doc';
import type { User } from 'models/user';
import { create } from 'zustand';

interface AuthorizedData {
  user: User;
  logOut(): void;
  createDoc(name: Doc['name']): Promise<void>;
  saveDocCode(): Promise<void>;
  makeDocPrivate(): Promise<void>;
  makeDocPublic(): Promise<void>;
  updateDocName(name: Doc['name']): Promise<void>;
  makeDocPermanent(
    name: Doc['name'],
    description: PermanentBlog['description'],
  ): Promise<void>;
  getDocs(): Promise<void>;
  deleteDoc(): Promise<void>;
  getPublicDoc(payload: GetDocPayload): Promise<Doc>;
}

interface UnauthrorizedData {
  logIn(): void;
  getPublicDoc(payload: GetDocPayload): Promise<Doc>;
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

export type { AuthorizedData };
export { useAuthStore, authStoreActions, authStoreSelectors };
