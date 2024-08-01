import React from 'react';
import { type AuthorizedData, authStoreActions } from 'store/auth/auth.store';
import { docManagementStoreActions } from 'store/doc-management/doc-management.store';
import { docStoreActions, docStoreSelectors } from 'store/doc/doc.store';
import {
  creatorStoreActions,
  creatorStoreSelectors,
} from 'store/creator/creator.store';
import { docsStoreActions, useDocsStore } from 'store/docs/docs.store';
import { imagesStoreActions } from 'store/images/images.store';
import { readFileAsBase64 } from '../development-kit/file-reading';
import {
  yourProfileStoreActions,
  yourProfileStoreSelectors,
} from 'store/your-profile/your-profile.store';
import {
  updateYourProfileStoreActions,
  updateYourProfileStoreSelectors,
} from 'store/update-your-profile/update-your-profile.store';
import { useAPI } from 'api-4markdown';
import type { API4MarkdownPayload } from 'api-4markdown-contracts';

const useAuth = () => {
  const api = useAPI();

  React.useEffect(() => {
    const { call, logOut, logIn, onAuthChange } = api;

    const updateDoc = async (
      payload: API4MarkdownPayload<'updateDoc'>,
    ): Promise<void> => {
      try {
        docManagementStoreActions.busy();
        const updatedDoc = await call(`updateDoc`)(payload);
        docManagementStoreActions.ok();
        docStoreActions.setActive(updatedDoc);
        docsStoreActions.updateDoc(updatedDoc);
        creatorStoreActions.asUnchanged();
      } catch (error: unknown) {
        docManagementStoreActions.fail(error);
        throw error;
      }
    };

    const getYourProfile: AuthorizedData['getYourProfile'] = async () => {
      yourProfileStoreActions.sync();

      if (
        yourProfileStoreSelectors.state().is === `ok` ||
        yourProfileStoreSelectors.state().is === `busy`
      )
        return;

      try {
        yourProfileStoreActions.busy();

        const profile = await call(`getYourUserProfile`)();

        yourProfileStoreActions.ok(profile);
      } catch (error: unknown) {
        yourProfileStoreActions.fail(error);
      }
    };

    const getDocs: AuthorizedData['getDocs'] = async () => {
      const state = useDocsStore.getState();

      if (state.is === `ok` || state.is === `busy`) {
        return;
      }

      try {
        docsStoreActions.busy();

        const docs = await call(`getDocs`)();

        docsStoreActions.ok(docs);
      } catch (error: unknown) {
        docsStoreActions.fail(error);
      }
    };

    const getAccessibleDocument = call(`getAccessibleDocument`);

    const reloadDocs: AuthorizedData['reloadDocs'] = async () => {
      try {
        docsStoreActions.idle();
        docsStoreActions.busy();

        const docs = await call(`getDocs`)();

        docsStoreActions.ok(docs);
        docStoreActions.reset();
      } catch (error: unknown) {
        docsStoreActions.fail(error);
      }
    };

    const rateDocument = call(`rateDocument`);

    const unsubscribe = onAuthChange(async (user) => {
      if (user) {
        authStoreActions.authorize({
          user: {
            avatar: user.photoURL,
            name: user.displayName,
          },
          logOut: async () => {
            try {
              await logOut();
              yourProfileStoreActions.idle();
            } catch {}
          },
          rateDocument,
          uploadImage: async (image) => {
            try {
              imagesStoreActions.busy();

              const data = await call(`uploadImage`)({
                image: await readFileAsBase64(image),
              });

              imagesStoreActions.ok();

              return data;
            } catch (error: unknown) {
              imagesStoreActions.fail(error);
              throw error;
            }
          },
          getAccessibleDocument,
          deleteDoc: async () => {
            const id = docStoreSelectors.active().id;

            try {
              docManagementStoreActions.busy();
              await call(`deleteDocument`)({ id });

              docManagementStoreActions.ok();
              docsStoreActions.deleteDoc(id);
              docStoreActions.reset();
              creatorStoreActions.init();
            } catch (error: unknown) {
              docManagementStoreActions.fail(error);
              throw error;
            }
          },
          getDocs,
          reloadDocs,
          getYourProfile,
          createDoc: async (name) => {
            const { code } = creatorStoreSelectors.ready();

            try {
              docManagementStoreActions.busy();
              const createdDoc = await call(`createDoc`)({ name, code });
              docManagementStoreActions.ok();
              docStoreActions.setActive(createdDoc);
              docsStoreActions.addDoc(createdDoc);
              creatorStoreActions.asUnchanged();
            } catch (error: unknown) {
              docManagementStoreActions.fail(error);
              throw error;
            }
          },
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
              const data = await call(`updateDocumentCode`)({
                id: newDoc.id,
                code: newDoc.code,
                mdate: newDoc.mdate,
              });
              const updatedDoc = {
                ...newDoc,
                mdate: data.mdate,
              };

              docManagementStoreActions.ok();
              docsStoreActions.updateDoc(updatedDoc);
              docStoreActions.setActive(updatedDoc);
              creatorStoreActions.asUnchanged();
            } catch (error: unknown) {
              docManagementStoreActions.fail(error);
            }
          },
          makeDocPrivate: async () => {
            const { id, name, mdate } = docStoreSelectors.active();
            const { code } = creatorStoreSelectors.ready();

            await updateDoc({
              id,
              mdate,
              name,
              code,
              visibility: `private`,
            });
          },
          makeDocPublic: async () => {
            const { id, name, mdate } = docStoreSelectors.active();
            const { code } = creatorStoreSelectors.ready();

            await updateDoc({
              id,
              mdate,
              name,
              code,
              visibility: `public`,
            });
          },
          makeDocPermanent: async (name, description, tags) => {
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
          },
          updateDocName: async (name) => {
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
          },
          updateYourProfile: async (payload) => {
            try {
              if (updateYourProfileStoreSelectors.state().is === `ok`) return;

              updateYourProfileStoreActions.busy();

              const data = await call(`updateYourUserProfile`)(payload);

              updateYourProfileStoreActions.ok(data);
              yourProfileStoreActions.ok(data);
            } catch (error: unknown) {
              updateYourProfileStoreActions.fail(error);
              throw error;
            }
          },
        });

        getDocs();
        getYourProfile();

        return;
      }

      docStoreActions.reset();
      docManagementStoreActions.idle();
      docsStoreActions.idle();
      yourProfileStoreActions.idle();

      authStoreActions.unauthorize({
        getAccessibleDocument,
        logIn: async () => {
          try {
            await logIn();
          } catch (error: unknown) {}
        },
      });
    });

    return () => {
      unsubscribe();
    };
  }, [api]);
};

export { useAuth };
