import { create } from 'zustand';

const state = <TValue>(initialValue: TValue) => {
  const useZustandStore = create(() => initialValue);

  const useState = () => useZustandStore;

  const replace: (typeof useZustandStore)['setState'] = (setter) => {
    useZustandStore.setState(setter, true);
  };

  useState.subscribe = useZustandStore.subscribe;
  useState.get = useZustandStore.getState;
  useState.getInitial = () => initialValue;
  useState.set = useZustandStore.setState;
  useState.reset = () => useZustandStore.setState(initialValue, true);
  useState.replace = replace;

  return useState;
};

export { state };
