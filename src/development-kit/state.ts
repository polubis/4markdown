import { create } from 'zustand';

type Setter<TValue> = TValue | ((value: TValue) => TValue);

const state = <TValue>(initialValue: TValue) => {
  const useZustandStore = create(() => initialValue);

  const useState = <TSelected = TValue>(
    selector?: (value: TValue) => TSelected,
  ) => useZustandStore(selector as (value: TValue) => TSelected);

  const swap = (setter: Setter<TValue>): void => {
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
