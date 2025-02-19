import React from 'react';
import { type ReactNode, useContext, createContext, useMemo } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const context = <TValueHook extends () => any>(useValueHook: TValueHook) => {
  type TContextValue = ReturnType<TValueHook>;

  const DynamicContext = createContext<TContextValue | null>(null);

  const DynamicProvider = ({ children }: { children: ReactNode }) => {
    const value = useValueHook();
    const memoizedValue = useMemo(() => value, [value]);

    return (
      <DynamicContext.Provider value={memoizedValue}>
        {children}
      </DynamicContext.Provider>
    );
  };

  const useDynamicContext = (): TContextValue => {
    const ctx = useContext(DynamicContext);

    if (!ctx)
      throw new Error(`Missing provider at the top of the component tree`);

    return ctx;
  };

  return [DynamicProvider, useDynamicContext] as const;
};

export { context };
