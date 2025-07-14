import React from "react";
import { syncAction } from "store/document-creator/actions";
import { CREATOR_STORE_LS_KEY } from "store/document-creator/config";

const useCreatorLocalStorageSync = () => {
  React.useEffect(() => {
    syncAction();

    const listener = (event: StorageEvent): void => {
      if (event.key === CREATOR_STORE_LS_KEY) syncAction();
    };

    window.addEventListener(`storage`, listener);

    return () => {
      window.removeEventListener(`storage`, listener);
    };
  }, []);
};

export { useCreatorLocalStorageSync };
