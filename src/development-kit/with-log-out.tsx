import React from 'react';
import { useAuthStore } from 'store/auth/auth.store';
import { signOut } from 'firebase/auth';

const WithLogOut = () => {
  React.useEffect(() => {
    const logOut = async () => {
      const state = useAuthStore.getState();

      if (state.is === `idle` || state.is === `unauthorized`) {
        return;
      }
      try {
        await signOut(state.auth);
      } catch (error: unknown) {}
    };

    logOut();
  }, []);

  return null;
};

export default WithLogOut;
