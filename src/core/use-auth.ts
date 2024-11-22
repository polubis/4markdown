import React from 'react';
import { authStoreActions } from 'store/auth/auth.store';
import { docManagementStoreActions } from 'store/doc-management/doc-management.store';
import { docStoreActions } from 'store/doc/doc.store';
import { docsStoreActions } from 'store/docs/docs.store';
import { yourProfileStoreActions } from 'store/your-profile/your-profile.store';
import { initializeAPI, removeCache } from 'api-4markdown';

const useAuth = () => {
  const [api] = React.useState(initializeAPI);

  React.useEffect(() => {
    const { logOut, logIn, onAuthChange } = api;

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
              removeCache(`getYourUserProfile`, `getYourDocuments`);
              yourProfileStoreActions.idle();
            } catch {}
          },
        });

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export { useAuth };
