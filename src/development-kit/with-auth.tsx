import React from 'react';
import { authStoreActions } from 'store/auth/auth.store';

const WithAuth = () => {
  React.useEffect(() => {
    const unsubscribe = authStoreActions.init();

    return () => {
      unsubscribe();
    };
  }, []);

  return null;
};

export default WithAuth;
