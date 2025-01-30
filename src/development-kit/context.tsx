import React, { type ReactNode } from 'react';

const context = <TValueHook extends (...args: any[]) => any>(
  useValueHook: TValueHook,
) => {
  type TContextValue = ReturnType<TValueHook>;

  const Context = React.createContext<TContextValue | null>(null);

  const Provider = ({ children }: { children: ReactNode }) => {
    const value = useValueHook();

    return <Context.Provider value={value}>{children}</Context.Provider>;
  };

  const useContext = (): TContextValue => {
    const ctx = React.useContext(Context);

    if (!ctx) throw Error(`Lack of provider at the top of components tree`);

    return ctx;
  };

  return [Provider, useContext] as const;
};

export { context };
