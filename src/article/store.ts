import { useSyncExternalStore } from 'react';

type Listener<TState> = (state: TState) => void;
type Unsubscribe = () => void;
type StateSetter<TState> =
  | Partial<TState>
  | ((state: TState) => Partial<TState>);
type StateReplacer<TState> = TState extends any
  ? TState | ((state: TState) => TState)
  : never;

const store = <TState>(state: TState) => {
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

  const replace = (replacer: StateReplacer<TState>): void => {
    state = typeof replacer === `function` ? replacer(get()) : replacer;
    emit(state);
  };

  const useStore = (): TState => useSyncExternalStore(subscribe, get);

  useStore.replace = replace;
  useStore.get = get;
  useStore.set = set;
  useStore.subscribe = subscribe;

  return useStore;
};

export { store };
