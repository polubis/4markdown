import React from 'react';

type FeatureState<TData> = { is: `on`; data: TData } | { is: `off` };

type FeatureReturn<TData> = TData extends undefined | null
  ? [
      FeatureState<TData>,
      {
        on: () => void;
        off: () => void;
        toggle: () => void;
      },
    ]
  : [
      FeatureState<TData>,
      { on: (data: TData) => void; off: () => void; },
    ];

// type Test1 = FeatureReturn<{ id: number }>[1];
// type Test2 = FeatureReturn;
// type Test3 = FeatureReturn<null>;

const useFeature = <TData = undefined>(
  initState: FeatureState<TData> | (() => FeatureState<TData>) = {
    is: `off`,
  },
) => {
  const [state, setState] = React.useState(initState);

  return [
    state,
    {
      on: (data: TData) => {
        setState({ is: `on`, data });
      },
      off: () => {
        setState({ is: `off` });
      },
      toggle: () => {
        setState(prevState => prevState.is=== `on` ? {is: `off`} : {is: })
      },
    },
  ] as FeatureReturn<TData>;
};

const Component = () => {
  const [state1, action1] = useFeature();
  const [state2, action2] = useFeature({ is: `on`, data: { id: `1` } });

  if (state1.is === `on`) {
    state1.data;
    action1.on();
  }

  if (state2.is === `on`) {
    state2.data;
    action2.on();
  }
};
