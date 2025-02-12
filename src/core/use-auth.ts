import React from 'react';
import { authStoreActions } from 'store/auth/auth.store';
import { docManagementStoreActions } from 'store/doc-management/doc-management.store';
import { docStoreActions } from 'store/doc/doc.store';
import { docsStoreActions } from 'store/docs/docs.store';
import { initializeAPI } from 'api-4markdown';
import { useYourUserProfileState } from 'store/your-user-profile';
import { useYourMindmapsState } from 'store/your-mindmaps';
import { useMindmapCreatorState } from 'store/mindmap-creator';

const useAuth = () => {
  const [api] = React.useState(initializeAPI);

  React.useEffect(() => {
    const unsubscribe = api.onAuthChange((user) => {
      if (user) {
        authStoreActions.authorize({
          avatar: user.photoURL,
          name: user.displayName,
        });

        return;
      }

      docStoreActions.reset();
      docManagementStoreActions.idle();
      docsStoreActions.idle();
      useYourUserProfileState.reset();
      authStoreActions.unauthorize();
      useMindmapCreatorState.reset();
      useYourMindmapsState.reset();
    });

    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export { useAuth };
