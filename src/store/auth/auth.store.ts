import type {
  User as FirebaseUser,
  Auth,
  GoogleAuthProvider,
} from 'firebase/auth';
import type { User } from 'models/user';
import { create } from 'zustand';

interface AuthStoreActions {
  authorize(auth: Auth, provider: GoogleAuthProvider, user: FirebaseUser): void;
  unauthorize(auth: Auth, provider: GoogleAuthProvider): void;
}

type AuthStoreStateIdle = { is: 'idle' };
type AuthStoreStateAuthorized = {
  is: 'authorized';
  user: User;
  auth: Auth;
  provider: GoogleAuthProvider;
};

type AuthStoreStateUnauthorized = {
  is: 'unauthorized';
  auth: Auth;
  provider: GoogleAuthProvider;
};

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
  authorize: (auth, provider, user) => {
    set({
      is: `authorized`,
      user: {
        name: user.displayName,
        avatar: user.photoURL,
      },
      auth,
      provider,
    });
  },
  unauthorize: (auth, provider) => {
    set({ is: `unauthorized`, auth, provider });
  },
};

export { useAuthStore, authStoreActions };
