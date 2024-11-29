import { create } from 'zustand';

const state = <TValue>(initialValue: TValue) => {
  const useZustandStore = create(() => initialValue);

  const useState = <TSelected = TValue>(
    selector?: (value: TValue) => TSelected,
  ) => useZustandStore(selector as (value: TValue) => TSelected);

  const swap = (setter: TValue | ((value: TValue) => TValue)): void => {
    useZustandStore.setState(setter, true);
  };

  useState.subscribe = useZustandStore.subscribe;
  useState.get = useZustandStore.getState;
  useState.getInitial = () => initialValue;
  useState.set = useZustandStore.setState;
  useState.reset = () => useZustandStore.setState(initialValue, true);
  useState.swap = swap;

  return useState;
};

export { state };
