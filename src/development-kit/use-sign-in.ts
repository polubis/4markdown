// import { useAuthStore } from 'store/auth/auth.store';

const MAX_MOBILE_WIDTH = 768;

const useSignIn = () => {
  const logIn = async () => {
    // const state = useAuthStore.getState();
    // if (state.is === `idle` || state.is === `authorized`) {
    //   return;
    // }
    // const { auth, provider } = state;
    // const {
    // browserLocalPersistence,
    // setPersistence,
    // signInWithPopup,
    // signInWithRedirect,
    // } = await import('firebase/auth');
    // try {
    //   await setPersistence(auth, browserLocalPersistence);
    //   const isMobileDevice =
    //     /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    //       navigator.userAgent,
    //     ) || window.innerWidth <= MAX_MOBILE_WIDTH;
    //   if (isMobileDevice) {
    //     await signInWithRedirect(auth, provider);
    //     return;
    //   }
    //   await signInWithPopup(auth, provider);
    // } catch (error: unknown) {}
  };

  const logOut = async () => {
    // const state = useAuthStore.getState();
    // if (state.is === `idle` || state.is === `unauthorized`) {
    //   return;
    // }
    // try {
    //   await signOut(state.auth);
    // } catch (error: unknown) {}
  };

  return [logIn, logOut] as const;
};

export { useSignIn };
