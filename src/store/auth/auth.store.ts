import { create } from 'zustand';
import { type FirebaseOptions, initializeApp } from 'firebase/app';
import {
  GoogleAuthProvider,
  type User,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from 'firebase/auth';

interface AuthStoreActions {
  signIn(mode: 'popup' | 'standalone'): void;
  signOut(): void;
}

interface AuthStoreSelectors {}

type AuthStoreStateIdle = { is: 'idle' };
type AuthStoreStateAuthorized = { is: 'authorized'; user: User };
type AuthStoreStateUnauthorized = { is: 'unauthorized' };
type AuthStoreStateFail = { is: 'fail' };

type AuthStoreState =
  | AuthStoreStateIdle
  | AuthStoreStateAuthorized
  | AuthStoreStateUnauthorized
  | AuthStoreStateFail;

const config: FirebaseOptions = {
  apiKey: process.env.GATSBY_API_KEY,
  authDomain: process.env.GATSBY_AUTH_DOMAIN,
  projectId: process.env.GATSBY_PROJECT_ID,
  storageBucket: process.env.GATSBY_STORAGE_BUCKET,
  messagingSenderId: process.env.GATSBY_MESSAGING_SENDER_ID,
  appId: process.env.GATSBY_APP_ID,
  measurementId: process.env.GATSBY_MEASURMENT_ID,
};

const app = initializeApp(config);
const auth = getAuth(app);
// const db = getFirestore(app);

const useAuthStore = create<AuthStoreState>(() => ({
  is: `idle`,
}));

const { setState } = useAuthStore;

const set = (state: AuthStoreState): void => {
  setState(state, true);
};

const authStoreSelectors: AuthStoreSelectors = {};

const authStoreActions: AuthStoreActions = {
  signIn: async (mode) => {
    const provider = new GoogleAuthProvider();

    try {
      if (mode === `popup`) {
        await signInWithPopup(auth, provider);
        return;
      }

      await signInWithRedirect(auth, provider);
    } catch (error: unknown) {
      set({ is: `fail` });
    }
  },
  signOut: async () => {
    try {
      await signOut(auth);
    } catch (error: unknown) {
      set({ is: `fail` });
    }
  },
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    set({ is: `authorized`, user });
    return;
  }

  set({ is: `unauthorized` });
});

export { useAuthStore, authStoreActions, authStoreSelectors };
