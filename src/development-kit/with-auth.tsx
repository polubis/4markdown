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
import type {
  CreateDocDto,
  CreateDocPayload,
  Doc,
  UpdateDocDto,
  UpdateDocPayload,
} from 'models/doc';
import {
  creatorStoreActions,
  creatorStoreSelectors,
} from 'store/creator/creator.store';
import { docsStoreActions, useDocsStore } from 'store/docs/docs.store';

const ENDPOINTS = {
  createDoc: `createDoc`,
  updateDoc: `updateDoc`,
  getDocs: `getDocs`,
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

    const getDocs = async (): Promise<void> => {
      const state = useDocsStore.getState();

      if (state.is === `ok` || state.is === `busy`) {
        return;
      }

      try {
        docsStoreActions.busy();

        const { data: docs } = await httpsCallable<undefined, Doc[]>(
          functions,
          ENDPOINTS.getDocs,
        )();

        docsStoreActions.ok(docs);

        if (docs.length > 0) {
          const [firstDoc] = docs;
          docStoreActions.setActive(firstDoc);
          creatorStoreActions.change(firstDoc.code);
          creatorStoreActions.setPrevCode(firstDoc.code);
        }
      } catch (error: unknown) {
        docsStoreActions.fail(error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
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
          getDocs,
          createDoc: async (name) => {
            const { code } = creatorStoreSelectors.ready();

            const doc: CreateDocPayload = { name, code };

            try {
              docManagementStoreActions.busy();
              const { data: createdDoc } = await httpsCallable<
                CreateDocPayload,
                CreateDocDto
              >(
                functions,
                ENDPOINTS.createDoc,
              )(doc);
              docManagementStoreActions.ok();
              docStoreActions.setActive(createdDoc);
              docsStoreActions.addDoc(createdDoc);
            } catch (error: unknown) {
              docManagementStoreActions.fail(error);
              throw error;
            }
          },
          updateDoc: async (name) => {
            const { id } = docStoreSelectors.active();
            const { code } = creatorStoreSelectors.ready();
            const doc: UpdateDocPayload = { id, name, code };

            try {
              docManagementStoreActions.busy();
              const { data: updatedDoc } = await httpsCallable<
                UpdateDocPayload,
                UpdateDocDto
              >(
                functions,
                ENDPOINTS.updateDoc,
              )(doc);
              docManagementStoreActions.ok();
              docStoreActions.setActive(updatedDoc);
              creatorStoreActions.setPrevCode(updatedDoc.code);
              docsStoreActions.updateDoc(updatedDoc);
            } catch (error: unknown) {
              docManagementStoreActions.fail(error);
              throw error;
            }
          },
        });
        getDocs();

        return;
      }

      docStoreActions.reset();
      docManagementStoreActions.idle();
      docsStoreActions.idle();
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
