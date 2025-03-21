import React, {
  type Dispatch,
  type SetStateAction,
  type ReactNode,
} from 'react';
import type {
  DocumentRatingCategory,
  PermanentDocumentDto,
  PublicDocumentDto,
} from 'api-4markdown-contracts';

type MindmapLayoutState = {
  document: PublicDocumentDto | PermanentDocumentDto;
  yourRate: DocumentRatingCategory | null;
};

type MindmapLayoutContextValue = [
  MindmapLayoutState,
  Dispatch<
    SetStateAction<{
      document: PublicDocumentDto | PermanentDocumentDto;
      yourRate: DocumentRatingCategory | null;
    }>
  >,
];

type MindmapLayoutProviderProps = {
  children: ReactNode;
  document: MindmapLayoutState['document'];
};

const MindmapLayoutContext =
  React.createContext<MindmapLayoutContextValue | null>(null);

const MindmapLayoutProvider = ({
  document,
  children,
}: MindmapLayoutProviderProps) => {
  const value = React.useState<MindmapLayoutState>(() => ({
    document,
    yourRate: null,
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
