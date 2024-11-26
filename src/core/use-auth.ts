import React from 'react';
import { getAPI, initializeAPI } from 'api-4markdown';
import { authorize } from 'store/auth/actions';
import { unauthorizeAct } from 'acts/unauthorize.act';

const useAuth = () => {
  React.useState(initializeAPI);

  React.useEffect(() => {
    const unsubscribe = getAPI().onAuthChange((user) => {
      user
        ? authorize({
            avatar: user.photoURL,
            name: user.displayName,
          })
        : unauthorizeAct();
    });

    return () => {
      unsubscribe();
    };
  }, []);
};

export { useAuth };
