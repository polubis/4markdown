import React from 'react';
import {
  CREATOR_STORE_LS_KEY,
  creatorStoreActions,
} from 'store/creator/creator.store';
import { DOC_STORE_LS_KEY, docStoreActions } from 'store/doc/doc.store';
import { DOCS_STORE_LS_KEY, docsStoreActions } from 'store/docs/docs.store';

const useLsSync = () => {
  React.useEffect(() => {
    creatorStoreActions.sync();
    docStoreActions.sync();
    docsStoreActions.sync();

    const listener = (event: StorageEvent) => {
      if (event.newValue === null) return;

      if (event.key === CREATOR_STORE_LS_KEY) {
        creatorStoreActions.sync();
      }

      if (event.key === DOC_STORE_LS_KEY) {
        docStoreActions.sync();
      }

      if (event.key === DOCS_STORE_LS_KEY) {
        docsStoreActions.sync();
      }
    };

    window.addEventListener(`storage`, listener);

    return () => {
      window.removeEventListener(`storage`, listener);
    };
  }, []);
};

export { useLsSync };
