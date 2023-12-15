import { authStoreActions } from 'store/auth/auth.store';
import { useAuthListen } from './use-auth-listen';

const useAuth = () => {
  useAuthListen((auth, user) => {
    authStoreActions.authorize(
      {
        name: user.displayName,
        avatar: user.photoURL,
      },
      auth,
    );
  }, authStoreActions.unauthorize);
};

export { useAuth };
