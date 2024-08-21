import { useEffect } from 'react';
import {
  CREATOR_STORE_LS_KEY,
  creatorStoreActions,
} from 'store/creator/creator.store';

const useCreatorLocalStorageSync = () => {
  useEffect(() => {
    creatorStoreActions.sync();

    const listener = (event: StorageEvent) => {
      if (event.key === CREATOR_STORE_LS_KEY) creatorStoreActions.sync();
    };

    window.addEventListener(`storage`, listener);

    return () => {
      window.removeEventListener(`storage`, listener);
    };
  }, []);
};

export { useCreatorLocalStorageSync };
