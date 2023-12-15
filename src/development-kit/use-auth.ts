import { authStoreActions } from 'store/auth/auth.store';
import { useAuthListen } from './use-auth-listen';

const useAuth = () => {
  useAuthListen({
    onUnauthorized: authStoreActions.unauthorize,
    onAuthorized: (auth, user) => {
      authStoreActions.authorize(
        {
          name: user.displayName,
          avatar: user.photoURL,
        },
        auth,
      );
    },
  });
};

export { useAuth };
