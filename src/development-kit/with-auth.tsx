import { FirebaseOptions, initializeApp } from 'firebase/app';
import {
  GoogleAuthProvider,
  browserLocalPersistence,
  getAuth,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from 'firebase/auth';
import React from 'react';
import { authStoreActions } from 'store/auth/auth.store';

const WithAuth = () => {

  React.useEffect(() => {
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

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      user
        ? authStoreActions.authorize({
            user: {
              avatar: user.photoURL,
              name: user.displayName,
            },
            logOut: async () => {
              try {
                await signOut(auth);
              } catch {}
            },
          })
        : authStoreActions.unauthorize({
            logIn: async () => {
              const MAX_MOBILE_WIDTH = 768;
              const provider = new GoogleAuthProvider();

              try {
                await setPersistence(auth, browserLocalPersistence);

                const isMobileDevice =
                  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                    navigator.userAgent,
                  ) || window.innerWidth <= MAX_MOBILE_WIDTH;

                if (isMobileDevice) {
                  await signInWithRedirect(auth, provider);
                  return;
                }

                await signInWithPopup(auth, provider);
              } catch (error: unknown) {}
            },
          });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return null;
};

export default WithAuth;
