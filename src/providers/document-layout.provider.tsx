import React, {
  type Dispatch,
  type SetStateAction,
  type ReactNode,
} from 'react';
import type {
  AccessibleDocumentDto,
  DocumentRatingCategory,
} from 'api-4markdown-contracts';

type DocumentLayoutState = {
  document: AccessibleDocumentDto;
  yourRate: DocumentRatingCategory | null;
};

type DocumentLayoutContextValue = [
  DocumentLayoutState,
  Dispatch<
    SetStateAction<{
      document: AccessibleDocumentDto;
      yourRate: DocumentRatingCategory | null;
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
  const value = React.useState<DocumentLayoutState>(() => ({
    document,
    yourRate: null,
  }));

  return (
    <DocumentLayoutContext.Provider value={value}>
      {children}
    </DocumentLayoutContext.Provider>
  );
};

const useDocumentLayoutContext = (): DocumentLayoutContextValue => {
  const ctx = React.useContext(DocumentLayoutContext);

  if (!ctx) throw Error(`Lack of provider for document layout`);

  return ctx;
};

export { DocumentLayoutProvider, useDocumentLayoutContext };
