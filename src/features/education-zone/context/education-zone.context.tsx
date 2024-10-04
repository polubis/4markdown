import type { EducationZoneViewModel } from 'models/view-models';
import React, {
  type ReactNode,
  type SetStateAction,
  type Dispatch,
} from 'react';

type EducationZoneProviderState = EducationZoneViewModel;

type EducationZoneProviderContext = [
  EducationZoneProviderState,
  Dispatch<SetStateAction<EducationZoneViewModel>>,
];

const Ctx = React.createContext<EducationZoneProviderContext | null>(null);

type EducationZoneProviderProps = {
  initialState: EducationZoneProviderState;
  children: ReactNode;
};

const EducationZoneProvider = ({
  children,
  initialState,
}: EducationZoneProviderProps) => {
  const [state, setState] = React.useState(initialState);

  const value = React.useMemo(
    (): EducationZoneProviderContext => [state, setState],
    [state],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

const useEducationZoneContext = (): EducationZoneProviderContext => {
  const ctx = React.useContext(Ctx);

  if (!ctx)
    throw Error(`Lack of ${EducationZoneProvider.name} in components tree`);

  return ctx;
};

export { EducationZoneProvider, useEducationZoneContext };
