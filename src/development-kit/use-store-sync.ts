import React from 'react';
import { create, type StoreApi, type UseBoundStore } from 'zustand';
import { isClient } from './ssr-csr';

const useStoreSync = <T>(
  useStore: UseBoundStore<StoreApi<T>>,
  initializer: (snapshot: T) => T,
  shouldSync: (snapshot: T) => boolean,
) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const snapshot = React.useMemo(() => useStore.getState(), []);
  const useServerStore = React.useMemo(
    () => create<T>(() => initializer(snapshot)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const sync = React.useMemo(() => shouldSync(snapshot), []);

  if (sync) {
    useStore.setState(initializer(snapshot));
  }

  return isClient() ? useStore : useServerStore;
};

export { useStoreSync };
