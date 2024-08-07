import type { Doc, GetDocPayload, PermanentDoc } from 'models/doc';
import { UploadImageDto } from 'models/image';
import type { UpdateYourProfilePayload, User } from 'models/user';
import { create } from 'zustand';

interface AuthorizedData {
  user: User;
  logOut(): void;
  createDoc(name: Doc['name']): Promise<void>;
  resyncDocuments(): Promise<void>;
  updateDocumentCode(): Promise<void>;
  makeDocPrivate(): Promise<void>;
  makeDocPublic(): Promise<void>;
  updateDocName(name: Doc['name']): Promise<void>;
  uploadImage(image: File): Promise<UploadImageDto>;
  makeDocPermanent(
    name: Doc['name'],
    description: PermanentDoc['description'],
    tags: PermanentDoc['tags'],
  ): Promise<void>;
  getDocs(): Promise<void>;
  reloadDocs(): Promise<void>;
  deleteDoc(): Promise<void>;
  getPublicDoc(payload: GetDocPayload): Promise<Doc>;
  getYourProfile(): Promise<void>;
  updateYourProfile(payload: UpdateYourProfilePayload): Promise<void>;
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

const useAuthStore = create<AuthStoreState>(() => ({
  is: `idle`,
}));

const { setState, getState } = useAuthStore;

const getAuthorized = (state: AuthStoreState): AuthStoreStateAuthorized => {
  if (state.is !== `authorized`)
    throw Error(`Tried to access authorized only state`);

  return state;
};

const authStoreSelectors = {
  authorized: () => getAuthorized(getState()),
  useAuthorized: () => useAuthStore(getAuthorized),
} as const;

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
