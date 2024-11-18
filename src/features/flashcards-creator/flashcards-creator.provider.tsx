import type { FlashcardDto } from 'api-4markdown-contracts';
import { useToggle, type ToggleReturn } from 'development-kit/use-toggle';
import React, { type ReactNode } from 'react';

type FlashcardsCreatorContext = {
  activeFlashcard: ToggleReturn<FlashcardDto>;
};

const Context = React.createContext<FlashcardsCreatorContext | null>(null);

type FlashcardsCreatorProviderProps = {
  children: ReactNode;
};

const FlashcardsCreatorProvider = ({
  children,
}: FlashcardsCreatorProviderProps) => {
  const activeFlashcard = useToggle<FlashcardDto>();

  const value = React.useMemo(
    () => ({
      activeFlashcard,
    }),
    [activeFlashcard],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

const useFlashcardsCreatorContext = () => {
  const ctx = React.useContext(Context);

  if (!ctx)
    throw Error(`Lack of ${FlashcardsCreatorProvider.name} in components tree`);

  return ctx;
};

export { FlashcardsCreatorProvider, useFlashcardsCreatorContext };
