import { useSyncExternalStore } from 'react';

type Listener<TState> = (state: TState) => void;
type Unsubscribe = () => void;
type StateSetter<TState> =
  | Partial<TState>
  | ((state: TState) => Partial<TState>);

const store = <TState, TName extends string = string>(
  state: TState,
  name: TName,
) => {
  const listeners = new Set<Listener<TState>>();

  const get = (): TState => state;

  const subscribe = (callback: Listener<TState>): Unsubscribe => {
    listeners.add(callback);
    return () => listeners.delete(callback);
  };

  const emit = (state: TState): void => {
    listeners.forEach((listener) => listener(state));
  };

  const set = (setter: StateSetter<TState>): void => {
    state = {
      ...state,
      ...(typeof setter === `function` ? setter(get()) : setter),
    };
    emit(state);
  };

  const useStore = (): TState => useSyncExternalStore(subscribe, get);

  useStore.get = get;
  useStore.set = set;
  useStore.subscribe = subscribe;

  return useStore;
};

export { store };
