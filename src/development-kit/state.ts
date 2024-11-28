import { create } from 'zustand';

const state = <TValue>(initialValue: TValue) => {
  const useZustandStore = create(() => initialValue);

  const useState = () => useZustandStore;

  useState.subscribe = useZustandStore.subscribe;
  useState.get = useZustandStore.getState;
  useState.getInitial = () => initialValue;
  useState.set = useZustandStore.setState;
  useState.replace = (state: TValue) => useZustandStore.setState(state, true);

  return useState;
};

export { state };
