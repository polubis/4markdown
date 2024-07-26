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
import { API4MarkdownContracts } from '../api-4markdown-contracts/contracts';
// @TODO: Decouple interfaces from Firebase and try to lazy load firebase/auth.

type ContractsKey = API4MarkdownContracts['key'];
type SpecificDto<TKey extends ContractsKey> = Promise<
  Extract<API4MarkdownContracts, { key: TKey }>['dto']
>;
type SpecificPayload<TKey extends ContractsKey> = Extract<
  API4MarkdownContracts,
  { key: TKey }
>['payload'];

interface API4Markdown {
  call<TKey extends ContractsKey>(
    key: TKey,
  ): SpecificPayload<TKey> extends undefined
    ? () => SpecificDto<TKey>
    : (payload: SpecificPayload<TKey>) => SpecificDto<TKey>;
  logIn(): Promise<void>;
  logOut(): Promise<void>;
  onAuthChange(
    nextOrObserver: NextOrObserver<User>,
    error?: ErrorFn,
    completed?: CompleteFn,
  ): Unsubscribe;
}

let instance: API4Markdown | null = null;

const initialize = (): API4Markdown => {
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

  if (!instance) {
    instance = {
      call:
        <TKey extends API4MarkdownContracts['key']>(key: TKey) =>
        async (payload) => {
          const { getFunctions, httpsCallable } = await import(
            `firebase/functions`
          );

          return (await httpsCallable(getFunctions(app), key)(payload))
            .data as SpecificDto<TKey>;
        },
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
  }

  return instance;
};

const useAPI = () => React.useState(initialize)[0];

export { useAPI };