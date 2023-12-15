import type { User as FirebaseUser, Auth } from 'firebase/auth';
import { User } from 'models/user';
import { create } from 'zustand';

interface AuthStoreActions {
  authorize(auth: Auth, user: FirebaseUser): void;
  unauthorize(auth: Auth): void;
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

const useAuthStore = create<AuthStoreState>(() => ({
  is: `idle`,
}));

const { setState } = useAuthStore;

const set = (state: AuthStoreState): void => {
  setState(state, true);
};

const authStoreActions: AuthStoreActions = {
  authorize: (auth, user) => {
    set({
      is: `authorized`,
      user: {
        name: user.displayName,
        avatar: user.photoURL,
      },
      auth,
    });
  },
  unauthorize: (auth) => {
    set({ is: `unauthorized`, auth });
  },
};

export { useAuthStore, authStoreActions };
