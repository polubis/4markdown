import { DocsBrowsePageContext } from 'models/pages-contexts';
import React from 'react';
import { create } from 'zustand';

interface DocsBrowseProviderContext extends DocsBrowsePageContext {}

interface DocsBrowseProviderProps {
  children: React.ReactNode;
  context: DocsBrowsePageContext;
}

const Context = React.createContext<DocsBrowseProviderContext | null>(null);

const DocsBrowseProvider = ({ children, context }: DocsBrowseProviderProps) => {
  const [useStore] = React.useState(() =>
    create<DocsBrowseProviderContext>(() => ({
      ...context,
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
