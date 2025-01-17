import React from 'react';

type Setter<TState> = TState | (() => TState);

type FeatureOnState = { is: `on` };
type FeatureOffState = { is: `off` };

type SimpleFeatureState = FeatureOnState | FeatureOffState;
type SimpleFeatureActions = {
  on(): void;
  off(): void;
  toggle(): void;
  reset(): void;
  set(setter: Setter<SimpleFeatureState>): void;
};
type SimpleFeature = [SimpleFeatureState, SimpleFeatureActions];

const useSimpleFeature = (
  defaultState: Setter<SimpleFeatureState> = { is: `off` },
): SimpleFeature => {
  const initState = React.useRef(defaultState);
  const [state, setState] = React.useState(defaultState);

  const on: SimpleFeatureActions['on'] = React.useCallback(() => {
    setState({ is: `on` });
  }, []);

  const off: SimpleFeatureActions['off'] = React.useCallback(() => {
    setState({ is: `off` });
  }, []);

  const toggle: SimpleFeatureActions['toggle'] = React.useCallback(() => {
    setState((prevState) =>
      prevState.is === `on` ? { is: `off` } : { is: `on` },
    );
  }, []);

  const reset: SimpleFeatureActions['reset'] = React.useCallback(() => {
    setState(initState.current);
  }, []);

  return [state, { on, off, toggle, set: setState, reset }];
};

export { useSimpleFeature };
