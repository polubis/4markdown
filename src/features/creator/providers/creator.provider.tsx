import React from 'react';
import { create } from 'zustand';

// The React Context value type definition
// and in the same time typings for our "store" state
// and actions.
interface CreatorProviderValue {
  count: number;
  increment(): void;
}

const useStore = create<CreatorProviderValue>((set) => ({
  count: 0,
  increment: () => {
    set(({ count }) => ({ count: count + 1 }));
  },
}));

const Context = React.createContext<CreatorProviderValue | null>(null);

const CreatorProvider = ({ children }: { children: React.ReactNode }) => {
  const store = useStore();

  return <Context.Provider value={store}>{children}</Context.Provider>;
};

const useCreatorProvider = (): CreatorProviderValue => {
  const ctx = React.useContext(Context);
  // Dev friendly exception if you forgot to wrap components with <Provider>.
  if (!ctx) throw Error(`Lack of provider`);

  return ctx;
};

export { CreatorProvider, useCreatorProvider };
