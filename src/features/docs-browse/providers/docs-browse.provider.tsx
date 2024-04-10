import { DocsBrowsePageContext } from 'models/pages-contexts';
import React from 'react';
import { StoreApi, UseBoundStore, create } from 'zustand';

interface DocsBrowseProviderContext extends DocsBrowsePageContext {
  set: UseBoundStore<StoreApi<DocsBrowseProviderContext>>['setState'];
}

interface DocsBrowseProviderProps {
  children: React.ReactNode;
  context: DocsBrowsePageContext;
}

const Context = React.createContext<DocsBrowseProviderContext | null>(null);

const DocsBrowseProvider = ({ children, context }: DocsBrowseProviderProps) => {
  const [useStore] = React.useState(() =>
    create<DocsBrowseProviderContext>((set) => ({
      ...context,
      set,
    })),
  );

  const store = useStore();

  return <Context.Provider value={store}>{children}</Context.Provider>;
};
const useDocsBrowseProvider = (): DocsBrowseProviderContext => {
  const ctx = React.useContext(Context);

  if (!ctx) throw Error(`Lack of provider`);

  return ctx;
};

export { DocsBrowseProvider, useDocsBrowseProvider };
