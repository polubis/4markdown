import { getFunctions, httpsCallable } from 'firebase/functions';
import { FirebaseOptions, initializeApp } from 'firebase/app';
import {
  GoogleAuthProvider,
  browserLocalPersistence,
  getAuth,
  onAuthStateChanged,
  setPersistence,
  signInWithRedirect,
  signOut,
} from 'firebase/auth';
import React from 'react';
import { authStoreActions } from 'store/auth/auth.store';
import { docManagementStoreActions } from 'store/doc-management/doc-management.store';
import { docStoreActions, docStoreSelectors } from 'store/doc/doc.store';
import type { Doc } from 'models/doc';
import { creatorStoreSelectors } from 'store/creator/creator.store';

const ENDPOINTS = {
  createDoc: `createDoc`,
  updateDoc: `updateDoc`,
} as const;

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
    const functions = getFunctions(app);
    const provider = new GoogleAuthProvider();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        authStoreActions.authorize({
          user: {
            avatar: user.photoURL,
            name: user.displayName,
          },
          logOut: async () => {
            try {
              await signOut(auth);
            } catch {}
          },
          createDoc: async (name) => {
            const { code } = creatorStoreSelectors.ready();

            const doc: Omit<Doc, 'id'> = { name, code };

            try {
              docManagementStoreActions.busy();
              const { data: id } = await httpsCallable<
                Omit<Doc, 'id'>,
                Doc['id']
              >(
                functions,
                ENDPOINTS.createDoc,
              )(doc);
              docManagementStoreActions.ok();
              docStoreActions.changeName(id, doc.name);
            } catch (error: unknown) {
              docManagementStoreActions.fail(error);
              throw error;
            }
          },
          updateDoc: async (name) => {
            const { id } = docStoreSelectors.active();
            const { code } = creatorStoreSelectors.ready();
            const doc: Doc = { id, name, code };

            try {
              docManagementStoreActions.busy();
              await httpsCallable<Doc>(functions, ENDPOINTS.updateDoc)(doc);
              docManagementStoreActions.ok();
              docStoreActions.changeName(id, doc.name);
            } catch (error: unknown) {
              docManagementStoreActions.fail(error);
              throw error;
            }
          },
        });
        return;
      }

      docStoreActions.reset();
      docManagementStoreActions.idle();
      authStoreActions.unauthorize({
        logIn: async () => {
          try {
            await setPersistence(auth, browserLocalPersistence);
            await signInWithRedirect(auth, provider);
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
