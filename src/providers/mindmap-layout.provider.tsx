import React, {
  type Dispatch,
  type SetStateAction,
  type ReactNode,
} from 'react';
import type { MindmapDto } from 'api-4markdown-contracts';

type MindmapLayoutState = {
  mindmap: MindmapDto;
};

type MindmapLayoutContextValue = [
  MindmapLayoutState,
  Dispatch<
    SetStateAction<{
      mindmap: MindmapDto;
    }>
  >,
];

type MindmapLayoutProviderProps = {
  children: ReactNode;
  mindmap: MindmapDto;
};

const MindmapLayoutContext =
  React.createContext<MindmapLayoutContextValue | null>(null);

const MindmapLayoutProvider = ({
  mindmap,
  children,
}: MindmapLayoutProviderProps) => {
  const value = React.useState<MindmapLayoutState>(() => ({
    mindmap,
  }));

  return (
    <MindmapLayoutContext.Provider value={value}>
      {children}
    </MindmapLayoutContext.Provider>
  );
};

const useMindmapLayoutContext = (): MindmapLayoutContextValue => {
  const ctx = React.useContext(MindmapLayoutContext);

  if (!ctx) throw Error(`Lack of provider for mindmap layout`);

  return ctx;
};

export { MindmapLayoutProvider, useMindmapLayoutContext };
