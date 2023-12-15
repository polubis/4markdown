import React from 'react';
import { type FirebaseOptions, initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { authStoreActions } from 'store/auth/auth.store';

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

const useAuth = () => {
  React.useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        authStoreActions.authorize(
          {
            name: user.displayName,
            avatar: user.photoURL,
          },
          auth,
        );
        return;
      }

      authStoreActions.unauthorize(auth);
    });
  }, []);
};

export { useAuth };
