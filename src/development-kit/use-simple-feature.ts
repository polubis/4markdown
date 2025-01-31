import React from 'react';

type Setter<TState> = TState | (() => TState);

type SimpleFeatureState = boolean;
type SimpleFeatureActions = {
  on(): void;
  off(): void;
  toggle(): void;
  reset(): void;
  set(setter: Setter<SimpleFeatureState>): void;
};
type SimpleFeature = SimpleFeatureActions & { isOff: boolean; isOn: boolean };

const useSimpleFeature = (
  defaultState: Setter<SimpleFeatureState> = false,
): SimpleFeature => {
  const [initState] = React.useState(defaultState);
  const [isOn, setIsOn] = React.useState(defaultState);

  const on: SimpleFeatureActions['on'] = React.useCallback(() => {
    setIsOn(true);
  }, []);

  const off: SimpleFeatureActions['off'] = React.useCallback(() => {
    setIsOn(false);
  }, []);

  const toggle: SimpleFeatureActions['toggle'] = React.useCallback(() => {
    setIsOn((prevIsOpen) => !prevIsOpen);
  }, []);

  const reset: SimpleFeatureActions['reset'] = React.useCallback(() => {
    setIsOn(initState);
  }, [initState]);

  return {
    isOn,
    isOff: !isOn,
    on,
    off,
    toggle,
    set: setIsOn,
    reset,
  };
};

export type { SimpleFeature };
export { useSimpleFeature };
