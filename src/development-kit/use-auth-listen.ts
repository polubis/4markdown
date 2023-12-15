import { FirebaseOptions, initializeApp } from '@firebase/app';
import {
  type User,
  onAuthStateChanged,
  getAuth,
  type Auth,
} from '@firebase/auth';
import React, { useRef } from 'react';

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

const useAuthListen = (
  onAuthorized: (auth: Auth, user: User) => void,
  onUnauthorized: (auth: Auth) => void = () => {},
) => {
  const onAuthRef = useRef(onAuthorized);
  const onUnauthRef = useRef(onUnauthorized);

  onAuthRef.current = onAuthorized;
  onUnauthRef.current = onUnauthorized;

  React.useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      user ? onAuthRef.current(auth, user) : onUnauthRef.current(auth);
    });
  }, []);
};

export { useAuthListen };
