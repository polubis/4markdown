import React, { useRef } from 'react';
import { useOnInteraction } from './use-on-interaction';
import { authStoreActions } from 'store/auth/auth.store';

const useAuthorizationAfterInteraction = () => {
  const interacted = useOnInteraction();
  const unsubscribe = useRef<null | (() => void)>(null);

  React.useEffect(() => {
    if (interacted) return;

    unsubscribe.current = authStoreActions.init();
  }, [interacted]);

  React.useEffect(() => {
    return () => {
      unsubscribe.current && unsubscribe.current();
    };
  });
};

const WithAuth = () => {
  useAuthorizationAfterInteraction();

  return null;
};

export default WithAuth;
