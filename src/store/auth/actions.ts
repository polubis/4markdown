import { useAuthState } from '.';
import type { AuthAuthorizedState } from './models';

const { setState: set } = useAuthState;

const authorize = (user: AuthAuthorizedState['user']): void => {
  set({
    is: `authorized`,
    user,
  });
};

const unauthorize = (): void => {
  set({ is: `unauthorized` });
};

export { authorize, unauthorize };
