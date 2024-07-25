import {
  getFunctions,
  HttpsCallable,
  httpsCallable,
  HttpsCallableOptions,
} from 'firebase/functions';
import { FirebaseOptions, initializeApp } from 'firebase/app';
import {
  CompleteFn,
  ErrorFn,
  GoogleAuthProvider,
  NextOrObserver,
  Unsubscribe,
  User,
  browserLocalPersistence,
  getAuth,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import React from 'react';

interface FirebaseInstance {
  call<TPayload, TResponse>(
    name: string,
    options?: HttpsCallableOptions,
  ): HttpsCallable<TPayload, TResponse>;
  logIn(): Promise<void>;
  logOut(): Promise<void>;
  onAuthChange(
    nextOrObserver: NextOrObserver<User>,
    error?: ErrorFn,
    completed?: CompleteFn,
  ): Unsubscribe;
}

const initializeInstance = (): FirebaseInstance => {
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
  const functions = getFunctions(app);
  const provider = new GoogleAuthProvider();

  return {
    call: (name, options) => httpsCallable(functions, name, options),
    logIn: async () => {
      await setPersistence(auth, browserLocalPersistence);

      const email = process.env.GATSBY_TEST_USER_EMAIL;
      const password = process.env.GATSBY_TEST_USER_PASSWORD;

      if (email !== undefined && password !== undefined) {
        await signInWithEmailAndPassword(auth, email, password);
        return;
      }

      await signInWithPopup(auth, provider);
    },
    logOut: async () => {
      await signOut(auth);
    },
    onAuthChange: (
      nextOrObserver: NextOrObserver<User>,
      error?: ErrorFn,
      completed?: CompleteFn,
    ) => onAuthStateChanged(auth, nextOrObserver, error, completed),
  };
};

const useFirebase = () => {
  const [instance] = React.useState(initializeInstance);

  return instance;
};

export { useFirebase };
