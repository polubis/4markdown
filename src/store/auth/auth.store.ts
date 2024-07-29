import type {
  API4MarkdownContract,
  API4MarkdownPayload,
  API4MarkdownDto,
  DocumentDto,
  PermanentDocumentDto,
} from 'api-4markdown-contracts';
import { create } from 'zustand';

interface AuthorizedData {
  user: {
    name: string | null;
    avatar: string | null;
  };
  logOut(): void;
  createDoc(name: DocumentDto['name']): Promise<void>;
  resyncDocuments(): Promise<void>;
  updateDocumentCode(): Promise<void>;
  makeDocPrivate(): Promise<void>;
  makeDocPublic(): Promise<void>;
  updateDocName(name: DocumentDto['name']): Promise<void>;
  uploadImage(image: File): API4MarkdownDto<'uploadImage'>;
  makeDocPermanent(
    name: DocumentDto['name'],
    description: PermanentDocumentDto['description'],
    tags: PermanentDocumentDto['tags'],
  ): Promise<void>;
  getDocs(): Promise<void>;
  reloadDocs(): Promise<void>;
  deleteDoc(): Promise<void>;
  getPublicDoc: API4MarkdownContract<'getPublicDoc'>;
  getYourProfile(): Promise<void>;
  updateYourProfile(
    payload: API4MarkdownPayload<'updateYourUserProfile'>,
  ): Promise<void>;
  rateDocument: API4MarkdownContract<'rateDocument'>;
}

interface UnauthrorizedData {
  logIn(): Promise<void>;
  getPublicDoc: API4MarkdownContract<'getPublicDoc'>;
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
