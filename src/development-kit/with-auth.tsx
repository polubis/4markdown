import { getFunctions, httpsCallable } from 'firebase/functions';
import { FirebaseOptions, initializeApp } from 'firebase/app';
import {
  GoogleAuthProvider,
  browserLocalPersistence,
  getAuth,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
} from 'firebase/auth';
import React from 'react';
import { AuthorizedData, authStoreActions } from 'store/auth/auth.store';
import { docManagementStoreActions } from 'store/doc-management/doc-management.store';
import { docStoreActions, docStoreSelectors } from 'store/doc/doc.store';
import type {
  CreateDocDto,
  CreateDocPayload,
  DeleteDocDto,
  DeleteDocPayload,
  Doc,
  GetDocDto,
  GetDocPayload,
  UpdateDocDto,
  UpdateDocPayload,
  UpdateDocumentCodePayload,
  UpdateDocumentCodeResponse,
} from 'models/doc';
import {
  creatorStoreActions,
  creatorStoreSelectors,
} from 'store/creator/creator.store';
import {
  docsStoreActions,
  docsStoreSelectors,
  useDocsStore,
} from 'store/docs/docs.store';
import { imagesStoreActions } from 'store/images/images.store';
import { readFileAsBase64 } from './file-reading';
import { UploadImageDto, UploadImagePayload } from 'models/image';
import {
  GetYourProfileDto,
  UpdateYourProfileDto,
  UpdateYourProfilePayload,
} from 'models/user';
import {
  yourProfileStoreActions,
  yourProfileStoreSelectors,
} from 'store/your-profile/your-profile.store';
import {
  updateYourProfileStoreActions,
  updateYourProfileStoreSelectors,
} from 'store/update-your-profile/update-your-profile.store';

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

    const getPublicDoc = async (payload: GetDocPayload) => {
      const { data: doc } = await httpsCallable<GetDocPayload, GetDocDto>(
        functions,
        `getPublicDoc`,
      )(payload);

      return doc;
    };

    const createDoc = async (name: Doc['name']) => {
      const { code } = creatorStoreSelectors.ready();

      const doc: CreateDocPayload = { name, code };

      try {
        docManagementStoreActions.busy();
        const { data: createdDoc } = await httpsCallable<
          CreateDocPayload,
          CreateDocDto
        >(
          functions,
          `createDoc`,
        )(doc);
        docManagementStoreActions.ok();
        docStoreActions.setActive(createdDoc);
        docsStoreActions.addDoc(createdDoc);
        creatorStoreActions.asUnchanged();
      } catch (error: unknown) {
        docManagementStoreActions.fail(error);
        throw error;
      }
    };

    const updateDoc = async (payload: UpdateDocPayload) => {
      try {
        docManagementStoreActions.busy();
        const { data: updatedDoc } = await httpsCallable<
          UpdateDocPayload,
          UpdateDocDto
        >(
          functions,
          `updateDoc`,
        )(payload);
        docManagementStoreActions.ok();
        docStoreActions.setActive(updatedDoc);
        docsStoreActions.updateDoc(updatedDoc);
        creatorStoreActions.asUnchanged();
      } catch (error: unknown) {
        docManagementStoreActions.fail(error);
        throw error;
      }
    };

    const uploadImage: AuthorizedData['uploadImage'] = async (image) => {
      try {
        imagesStoreActions.busy();

        const { data } = await httpsCallable<
          UploadImagePayload,
          UploadImageDto
        >(
          functions,
          `uploadImage`,
        )({ image: await readFileAsBase64(image) });

        imagesStoreActions.ok();

        return data;
      } catch (error: unknown) {
        imagesStoreActions.fail(error);
        throw error;
      }
    };

    const updateYourProfile: AuthorizedData['updateYourProfile'] = async (
      payload,
    ) => {
      try {
        if (updateYourProfileStoreSelectors.state().is === `ok`) return;

        updateYourProfileStoreActions.busy();

        const { data } = await httpsCallable<
          UpdateYourProfilePayload,
          UpdateYourProfileDto
        >(
          functions,
          `updateYourUserProfile`,
        )(payload);

        updateYourProfileStoreActions.ok(data);
        yourProfileStoreActions.ok(data);
      } catch (error: unknown) {
        updateYourProfileStoreActions.fail(error);
        throw error;
      }
    };

    const getYourProfile = async () => {
      try {
        if (
          yourProfileStoreSelectors.state().is === `ok` ||
          yourProfileStoreSelectors.state().is === `busy`
        )
          return;

        yourProfileStoreActions.busy();
        const { data: profile } = await httpsCallable<
          undefined,
          GetYourProfileDto
        >(functions, `getYourUserProfile`)();

        yourProfileStoreActions.ok(profile);
      } catch (error: unknown) {
        yourProfileStoreActions.fail(error);
      }
    };

    const makeDocPrivate: AuthorizedData['makeDocPrivate'] = async () => {
      const { id, name, mdate } = docStoreSelectors.active();
      const { code } = creatorStoreSelectors.ready();

      await updateDoc({
        id,
        mdate,
        name,
        code,
        visibility: `private`,
      });
    };

    const makeDocPublic: AuthorizedData['makeDocPublic'] = async () => {
      const { id, name, mdate } = docStoreSelectors.active();
      const { code } = creatorStoreSelectors.ready();

      await updateDoc({
        id,
        mdate,
        name,
        code,
        visibility: `public`,
      });
    };

    const makeDocPermanent: AuthorizedData['makeDocPermanent'] = async (
      name,
      description,
      tags,
    ) => {
      const { id, mdate } = docStoreSelectors.active();
      const { code } = creatorStoreSelectors.ready();

      await updateDoc({
        mdate,
        id,
        name,
        code,
        visibility: `permanent`,
        description,
        tags,
      });
    };

    const updateDocName: AuthorizedData['updateDocName'] = async (name) => {
      const doc = docStoreSelectors.active();
      const { code } = creatorStoreSelectors.ready();

      if (doc.visibility === `private`) {
        return await updateDoc({
          code,
          name,
          id: doc.id,
          mdate: doc.mdate,
          visibility: `private`,
        });
      }

      if (doc.visibility === `public`) {
        return await updateDoc({
          code,
          name,
          id: doc.id,
          mdate: doc.mdate,
          visibility: `public`,
        });
      }

      return await updateDoc({
        code,
        name,
        tags: doc.tags,
        description: doc.description,
        id: doc.id,
        mdate: doc.mdate,
        visibility: `permanent`,
      });
    };

    const reloadDocs = async (): Promise<void> => {
      try {
        docsStoreActions.idle();
        docsStoreActions.busy();

        const { data: docs } = await httpsCallable<undefined, Doc[]>(
          functions,
          `getDocs`,
        )();

        docsStoreActions.ok(docs);
        docStoreActions.reset();
      } catch (error: unknown) {
        docsStoreActions.fail(error);
      }
    };

    const getDocs = async (): Promise<void> => {
      const state = useDocsStore.getState();

      if (state.is === `ok` || state.is === `busy`) {
        return;
      }

      try {
        docsStoreActions.busy();

        const { data: docs } = await httpsCallable<undefined, Doc[]>(
          functions,
          `getDocs`,
        )();

        docsStoreActions.ok(docs);
      } catch (error: unknown) {
        docsStoreActions.fail(error);
      }
    };

    const deleteDoc = async (id: Doc['id']): Promise<void> => {
      try {
        docManagementStoreActions.busy();
        await httpsCallable<DeleteDocPayload, DeleteDocDto>(
          functions,
          `deleteDoc`,
        )({ id });

        docManagementStoreActions.ok();
        docsStoreActions.deleteDoc(id);

        const { docs } = docsStoreSelectors.ok();
        const lastDoc = docs[docs.length - 1];

        if (lastDoc) {
          docStoreActions.setActive(lastDoc);
          creatorStoreActions.change(lastDoc.code);
          creatorStoreActions.asUnchanged();
          return;
        }

        const code = `# Start from scratch`;
        docStoreActions.reset();
        creatorStoreActions.change(code);
        creatorStoreActions.asUnchanged();
      } catch (error: unknown) {
        docManagementStoreActions.fail(error);
        throw error;
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
          uploadImage,
          getPublicDoc,
          deleteDoc: async () => {
            await deleteDoc(docStoreSelectors.active().id);
          },
          getDocs,
          reloadDocs,
          getYourProfile,
          createDoc,
          resyncDocuments: async () => {
            docManagementStoreActions.idle();
            reloadDocs();
          },
          updateDocumentCode: async () => {
            const doc = docStoreSelectors.active();
            const { code } = creatorStoreSelectors.ready();

            const newDoc = {
              ...doc,
              code,
            };

            try {
              docManagementStoreActions.busy();
              const response = await httpsCallable<
                UpdateDocumentCodePayload,
                UpdateDocumentCodeResponse
              >(
                functions,
                `updateDoc`,
              )({ id: newDoc.id, code: newDoc.code, mdate: newDoc.mdate });
              docManagementStoreActions.ok();
              docsStoreActions.updateDoc({
                ...newDoc,
                mdate: response.data.mdate,
              });
              creatorStoreActions.asUnchanged();
            } catch (error: unknown) {
              docManagementStoreActions.fail(error);
            }

            await updateDoc({
              ...doc,
              code,
            });
          },
          makeDocPrivate,
          makeDocPublic,
          makeDocPermanent,
          updateDocName,
          updateYourProfile,
        });

        getDocs();
        getYourProfile();

        return;
      }

      docStoreActions.reset();
      docManagementStoreActions.idle();
      docsStoreActions.idle();

      authStoreActions.unauthorize({
        getPublicDoc,
        logIn: async () => {
          try {
            await setPersistence(auth, browserLocalPersistence);

            const email = process.env.GATSBY_TEST_USER_EMAIL;
            const password = process.env.GATSBY_TEST_USER_PASSWORD;

            if (email !== undefined && password !== undefined) {
              await signInWithEmailAndPassword(auth, email, password);
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
