import React from 'react';
import { type AuthorizedData, authStoreActions } from 'store/auth/auth.store';
import { docManagementStoreActions } from 'store/doc-management/doc-management.store';
import { docStoreActions, docStoreSelectors } from 'store/doc/doc.store';
import {
  creatorStoreActions,
  creatorStoreSelectors,
} from 'store/creator/creator.store';
import { docsStoreActions } from 'store/docs/docs.store';
import { imagesStoreActions } from 'store/images/images.store';
import { readFileAsBase64 } from '../development-kit/file-reading';
import { yourProfileStoreActions } from 'store/your-profile/your-profile.store';
import { updateYourProfileStoreActions } from 'store/update-your-profile/update-your-profile.store';
import { useAPI } from 'api-4markdown';
import type { API4MarkdownPayload } from 'api-4markdown-contracts';

const useAuth = () => {
  const api = useAPI();

  React.useEffect(() => {
    const { call, logOut, logIn, onAuthChange } = api;

    const updateDocumentVisibility = async (
      payload: API4MarkdownPayload<'updateDocumentVisibility'>,
    ): Promise<void> => {
      try {
        docManagementStoreActions.busy();
        const updatedDocument = await call(`updateDocumentVisibility`)(payload);
        docManagementStoreActions.ok();
        docStoreActions.setActive(updatedDocument);
        docsStoreActions.updateDoc(updatedDocument);
        creatorStoreActions.asUnchanged();
      } catch (error: unknown) {
        docManagementStoreActions.fail(error);
        throw error;
      }
    };
    // @TODO[PRIO=2]: [Move it to your profile store].
    const getYourProfile: AuthorizedData['getYourProfile'] = async () => {
      try {
        yourProfileStoreActions.busy();

        const response = await call(`getYourUserProfile`)();

        yourProfileStoreActions.ok({
          mdate: response?.mdate ?? null,
          user: response?.profile ?? null,
        });
      } catch (error: unknown) {
        yourProfileStoreActions.fail(error);
      }
    };

    const getYourDocuments = async (onSuccess?: () => void): Promise<void> => {
      try {
        docsStoreActions.busy();

        const docs = await call(`getYourDocuments`)();

        docsStoreActions.ok(docs);

        onSuccess?.();
      } catch (error: unknown) {
        docsStoreActions.fail(error);
      }
    };

    const reloadDocs: AuthorizedData['reloadDocs'] = async () => {
      docsStoreActions.idle();
      await getYourDocuments(() => docStoreActions.reset());
    };

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
          reloadDocs,
          getYourProfile,
          // @TODO[PRIO=2]: [Move it to creator store directory].
          createDoc: async (name) => {
            const { code } = creatorStoreSelectors.ready();

            try {
              docManagementStoreActions.busy();
              const createdDoc = await call(`createDocument`)({ name, code });
              docManagementStoreActions.ok();
              docStoreActions.setActive(createdDoc);
              docsStoreActions.addDoc(createdDoc);
              creatorStoreActions.asUnchanged();
            } catch (error: unknown) {
              docManagementStoreActions.fail(error);
              throw error;
            }
          },
          // @TODO[PRIO=2]: [Move it to creator store directory].
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
            const { id, mdate } = docStoreSelectors.active();

            await updateDocumentVisibility({
              id,
              mdate,
              visibility: `private`,
            });
          },
          makeDocPublic: async () => {
            const { id, mdate } = docStoreSelectors.active();

            await updateDocumentVisibility({
              id,
              mdate,
              visibility: `public`,
            });
          },
          makeDocPermanent: async (name, description, tags) => {
            const { id, mdate } = docStoreSelectors.active();

            await updateDocumentVisibility({
              mdate,
              id,
              name,
              visibility: `permanent`,
              description,
              tags,
            });
          },
          updateYourProfile: async (payload) => {
            try {
              updateYourProfileStoreActions.busy();

              const { mdate, profile } = await call(`updateYourUserProfile`)(
                payload,
              );

              updateYourProfileStoreActions.ok();
              yourProfileStoreActions.ok({ mdate, user: profile });
            } catch (error: unknown) {
              updateYourProfileStoreActions.fail(error);
              throw error;
            }
          },
        });

        getYourDocuments();
        getYourProfile();

        return;
      }

      docStoreActions.reset();
      docManagementStoreActions.idle();
      docsStoreActions.idle();
      yourProfileStoreActions.idle();

      authStoreActions.unauthorize({
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
