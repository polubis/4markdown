import React, { type ReactNode } from 'react';

type CreationAssistantContextValue = {
  close(): void;
};

type CreationAssistantProviderProps = {
  children: ReactNode;
  onClose(): void;
};

const CreationAssistantContext =
  React.createContext<CreationAssistantContextValue | null>(null);

const CreationAssistantProvider = ({
  children,
  onClose,
}: CreationAssistantProviderProps) => {
  const value = React.useMemo(
    () => ({
      close: onClose,
    }),
    [onClose],
  );

  return (
    <CreationAssistantContext.Provider value={value}>
      {children}
    </CreationAssistantContext.Provider>
  );
};

const useCreationAssistantContext = (): CreationAssistantContextValue => {
  const ctx = React.useContext(CreationAssistantContext);

  if (!ctx) throw Error(`Lack of provider for mindmap layout`);

  return ctx;
};

export type { CreationAssistantProviderProps };
export { CreationAssistantProvider, useCreationAssistantContext };
