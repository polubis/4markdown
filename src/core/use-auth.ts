import React from 'react';
import { type AuthorizedData, authStoreActions } from 'store/auth/auth.store';
import { docManagementStoreActions } from 'store/doc-management/doc-management.store';
import { docStoreActions } from 'store/doc/doc.store';
import { docsStoreActions } from 'store/docs/docs.store';
import { imagesStoreActions } from 'store/images/images.store';
import { readFileAsBase64 } from '../development-kit/file-reading';
import { yourProfileStoreActions } from 'store/your-profile/your-profile.store';
import { updateYourProfileStoreActions } from 'store/update-your-profile/update-your-profile.store';
import { useAPI, unobserveAll } from 'api-4markdown';

const useAuth = () => {
  const api = useAPI();

  React.useEffect(() => {
    const { call, logOut, logIn, onAuthChange } = api;

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
          getYourProfile,
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
      unobserveAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export { useAuth };
