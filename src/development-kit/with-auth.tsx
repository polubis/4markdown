import { FirebaseOptions, initializeApp } from 'firebase/app';
import { GoogleAuthProvider, getAuth, onAuthStateChanged } from 'firebase/auth';
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
    const provider = new GoogleAuthProvider();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      user
        ? authStoreActions.authorize(auth, provider, user)
        : authStoreActions.unauthorize(auth, provider);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return null;
};

export default WithAuth;
