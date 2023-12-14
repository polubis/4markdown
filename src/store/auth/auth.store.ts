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
  browserLocalPersistence,
  setPersistence,
} from 'firebase/auth';

interface AuthStoreActions {
  // init(): void;
  // signIn(mode: 'popup' | 'standalone'): void;
  // signOut(): void;
  init(): void;
}

interface AuthStoreSelectors {}

type AuthorizedUser = Pick<User, 'displayName' | 'photoURL'>;

type AuthStoreStateIdle = { is: 'idle' };
type AuthStoreStateAuthorized = { is: 'authorized'; user: AuthorizedUser };
type AuthStoreStateUnauthorized = { is: 'unauthorized' };

type AuthStoreState =
  | AuthStoreStateIdle
  | AuthStoreStateAuthorized
  | AuthStoreStateUnauthorized;

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

let isListenerAdded = false;

const authStoreActions: AuthStoreActions = {
  init: () => {
    if (isListenerAdded) return;

    onAuthStateChanged(auth, (user) => {
      if (user) {
        set({
          is: `authorized`,
          user: {
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
        });
        return;
      }

      set({ is: `unauthorized` });
    });

    isListenerAdded = true;
  },
  // signIn: async (mode) => {
  //   const state = get();

  //   if (state.is === `idle` || state.is === `authorized`) {
  //     return;
  //   }

  //   const provider = new GoogleAuthProvider();

  //   try {
  //     await setPersistence(auth, browserLocalPersistence);

  //     if (mode === `popup`) {
  //       await signInWithPopup(auth, provider);
  //       return;
  //     }

  //     await signInWithRedirect(auth, provider);
  //   } catch (error: unknown) {
  //     console.log(error.message);
  //     set({ is: `fail` });
  //   }
  // },
  // signOut: async () => {
  //   const state = get();

  //   if (state.is === `authorized`) {
  //     return;
  //   }

  //   try {
  //     await signOut(auth);
  //   } catch (error: unknown) {
  //     set({ is: `fail` });
  //   }
  // },
};

export { useAuthStore, authStoreActions, authStoreSelectors };
