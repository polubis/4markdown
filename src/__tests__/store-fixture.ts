import { renderHook, act } from '@testing-library/react';
import type { StoreApi, UseBoundStore } from 'zustand';

const storeFixture = <T>(
  useStore: UseBoundStore<StoreApi<T>>,
  defaultState?: T,
) => {
  const initialState = useStore.getState();

  if (defaultState) {
    act(() => {
      useStore.setState(defaultState);
    });
  }

  const restore = (): void => {
    act(() => {
      useStore.setState(initialState);
    });
  };

  const { result } = renderHook(() => useStore());

  return {
    restore,
    result,
  };
};

export { storeFixture };
