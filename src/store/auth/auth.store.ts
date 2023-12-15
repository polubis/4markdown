import { FirebaseOptions, initializeApp } from 'firebase/app';
import { onAuthStateChanged, type Auth, getAuth } from 'firebase/auth';
import type { User } from 'models/user';
import { create } from 'zustand';

interface AuthStoreActions {
  init(): () => void;
}

type AuthStoreStateIdle = { is: 'idle' };
type AuthStoreStateAuthorized = {
  is: 'authorized';
  user: User;
  auth: Auth;
};

type AuthStoreStateUnauthorized = { is: 'unauthorized'; auth: Auth };

type AuthStoreState =
  | AuthStoreStateIdle
  | AuthStoreStateAuthorized
  | AuthStoreStateUnauthorized;

const initialized = false;
let auth: Auth;

const useAuthStore = create<AuthStoreState>(() => ({
  is: `idle`,
}));

const { setState } = useAuthStore;

const set = (state: AuthStoreState): void => {
  setState(state, true);
};

const authStoreActions: AuthStoreActions = {
  init: () => {
    if (initialized) {
      throw Error(`Stop trying to initalize Firebase multiple times`);
    }

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
    auth = getAuth(app);

    return onAuthStateChanged(auth, (user) => {
      user
        ? set({
            is: `authorized`,
            user: {
              name: user.displayName,
              avatar: user.photoURL,
            },
            auth,
          })
        : set({ is: `unauthorized`, auth });
    });
  },
};

export { useAuthStore, authStoreActions };
