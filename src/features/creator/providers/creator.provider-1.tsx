import React from 'react';
import { create } from 'zustand';

interface CreatorProviderValue {
  count: number;
  increment(): void;
}

const Context = React.createContext<CreatorProviderValue | null>(null);

const CreatorProvider = ({ children }: { children: React.ReactNode }) => {
  const useStore = React.useMemo(
    () =>
      create<CreatorProviderValue>((set) => ({
        count: 0,
        increment: () => {
          set(({ count }) => ({ count: count + 1 }));
        },
      })),
    [],
  );

  const store = useStore();

  return <Context.Provider value={store}>{children}</Context.Provider>;
};

const useCreatorProvider = (): CreatorProviderValue => {
  const ctx = React.useContext(Context);

  if (!ctx) throw Error(`Lack of provider`);

  return ctx;
};

export { CreatorProvider, useCreatorProvider };
