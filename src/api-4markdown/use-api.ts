import type {
  API4MarkdownContractCall,
  API4MarkdownContractKey,
  API4MarkdownDto,
  NoInternetError,
} from 'api-4markdown-contracts';
import { type FirebaseOptions, initializeApp } from 'firebase/app';
import type { Functions } from 'firebase/functions';
import {
  type CompleteFn,
  type ErrorFn,
  GoogleAuthProvider,
  type NextOrObserver,
  type Unsubscribe,
  type User,
  browserLocalPersistence,
  getAuth,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { emit } from './observer';
// @TODO[PRIO=2]: [Decouple from Firebase interfaces, and lazy load what can be lazy loaded].

// @TODO[PRIO=2]: [Make this API less "object" oriented, maybe there is a possibility to three-shake it].
type API4Markdown = {
  call: API4MarkdownContractCall;
  logIn(): Promise<void>;
  logOut(): Promise<void>;
  onAuthChange(
    nextOrObserver: NextOrObserver<User>,
    error?: ErrorFn,
    completed?: CompleteFn,
  ): Unsubscribe;
};

let instance: API4Markdown | null = null;
let functions: Functions | null = null;

const isOffline = (): boolean =>
  typeof window !== `undefined` && !navigator.onLine;

class NoInternetException extends Error {}

const initializeAPI = (): API4Markdown => {
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
        <TKey extends API4MarkdownContractKey>(key: TKey) =>
        async (payload) => {
          try {
            if (isOffline()) throw new NoInternetException();

            const { getFunctions, httpsCallable } = await import(
              `firebase/functions`
            );

            if (!functions) {
              functions = getFunctions(app);
            }

            const dto = (
              await httpsCallable<unknown, API4MarkdownDto<TKey>>(
                functions,
                key,
              )(payload)
            ).data;
            // @TODO[PRIO=4]: [Go back here and improve type defs to make].
            emit(key, { is: `ok`, dto, payload: payload as any });

            return dto;
          } catch (rawError: unknown) {
            try {
              if (rawError instanceof NoInternetException) {
                const noInternetError: NoInternetError = {
                  content: `Lack of internet`,
                  message: `Lack of internet`,
                  symbol: `no-internet`,
                };

                throw Error(JSON.stringify(noInternetError));
              }

              throw rawError;
            } catch (error: unknown) {
              emit(key, { is: `fail`, error });
              throw error;
            }
          }
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

const getAPI = (): API4Markdown => {
  if (!instance) {
    throw Error(`Instance of API is not read to be used`);
  }

  return instance;
};

export { initializeAPI, getAPI };
