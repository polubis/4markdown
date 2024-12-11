import { renderHook, act } from '@testing-library/react';
import type { state } from './state';

const storeFixture = <T>(
  useStore: ReturnType<typeof state<T>>,
  defaultState?: T,
) => {
  if (defaultState) {
    act(() => {
      useStore.set(defaultState);
    });
  }

  const restore = (): void => {
    act(() => {
      useStore.set(useStore.getInitial());
    });
  };

  const { result } = renderHook(() => useStore());

  return {
    restore,
    result,
  };
};

export { storeFixture };
