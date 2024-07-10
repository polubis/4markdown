import { EducationZonePageContext } from 'models/pages-contexts';
import React from 'react';
import { StoreApi, UseBoundStore, create } from 'zustand';

interface EducationZoneProviderContext extends EducationZonePageContext {
  set: UseBoundStore<StoreApi<EducationZoneProviderContext>>['setState'];
}

interface EducationZoneProviderProps {
  children: React.ReactNode;
  context: EducationZonePageContext;
}

const Context = React.createContext<EducationZoneProviderContext | null>(null);

const EducationZoneProvider = ({
  children,
  context,
}: EducationZoneProviderProps) => {
  const [useStore] = React.useState(() =>
    create<EducationZoneProviderContext>((set) => ({
      ...context,
      set,
    })),
  );

  const store = useStore();

  return <Context.Provider value={store}>{children}</Context.Provider>;
};
const useEducationZoneCtx = (): EducationZoneProviderContext => {
  const ctx = React.useContext(Context);

  if (!ctx) throw Error(`Lack of provider`);

  return ctx;
};

export { EducationZoneProvider, useEducationZoneCtx };
