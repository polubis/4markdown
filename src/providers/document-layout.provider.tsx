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

type DocumentLayoutState = {
  document: PublicDocumentDto | PermanentDocumentDto;
  yourRate: DocumentRatingCategory | null;
};

type DocumentLayoutContextValue = [
  DocumentLayoutState,
  Dispatch<
    SetStateAction<{
      document: PublicDocumentDto | PermanentDocumentDto;
      yourRate: null;
    }>
  >,
];

type DocumentLayoutProviderProps = {
  children: ReactNode;
  document: DocumentLayoutState['document'];
};

const DocumentLayoutContext =
  React.createContext<DocumentLayoutContextValue | null>(null);

const DocumentLayoutProvider = ({
  document,
  children,
}: DocumentLayoutProviderProps) => {
  const value = React.useState(() => ({
    document,
    yourRate: null,
  }));

  return (
    <DocumentLayoutContext.Provider value={value}>
      {children}
    </DocumentLayoutContext.Provider>
  );
};

const useDocumentLayoutContext = () => {
  const ctx = React.useContext(DocumentLayoutContext);

  if (!ctx) throw Error(`Lack of provider for document layout`);

  return ctx;
};

export { DocumentLayoutProvider, useDocumentLayoutContext };
