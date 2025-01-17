import React from 'react';

type Setter<TState> = TState | (() => TState);

type FeatureOnState<TData> = { is: `on`; data: TData };
type FeatureOffState = { is: `off` };

type FeatureState<TData> = FeatureOnState<TData> | FeatureOffState;
type FeatureActions<TData> = {
  on(data: TData): void;
  off(): void;
  reset(): void;
  set(setter: Setter<FeatureState<TData>>): void;
};
type Feature<TData> = FeatureState<TData> & FeatureActions<TData>;

const useFeature = <TData>(
  defaultState: Setter<FeatureState<TData>> = { is: `off` },
): Feature<TData> => {
  const initState = React.useRef(defaultState);
  const [state, setState] = React.useState(defaultState);

  const on: FeatureActions<TData>['on'] = React.useCallback((data) => {
    setState({ is: `on`, data });
  }, []);

  const off: FeatureActions<TData>['off'] = React.useCallback(() => {
    setState({ is: `off` });
  }, []);

  const reset: FeatureActions<TData>['reset'] = React.useCallback(() => {
    setState(initState.current);
  }, []);

  return { ...state, on, off, set: setState, reset };
};

export { useFeature };
