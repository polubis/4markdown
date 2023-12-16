import React from 'react';
import {
  CREATOR_STORE_LS_KEY,
  creatorStoreActions,
} from 'store/creator/creator.store';
import { DOC_STORE_LS_KEY, docStoreActions } from 'store/doc/doc.store';

const useLsSync = () => {
  React.useEffect(() => {
    creatorStoreActions.sync();
    docStoreActions.sync();
  }, []);

  React.useEffect(() => {
    const listener = (event: StorageEvent) => {
      if (event.key === CREATOR_STORE_LS_KEY && event.newValue !== null) {
        creatorStoreActions.sync();
      }

      if (event.key === DOC_STORE_LS_KEY && event.newValue !== null) {
        docStoreActions.sync();
      }
    };

    window.addEventListener(`storage`, listener);

    return () => {
      window.removeEventListener(`storage`, listener);
    };
  }, []);
};

export { useLsSync };
