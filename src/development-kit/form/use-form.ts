import React from 'react';
import { ValidatorsSetup, form } from '.';

const useForm = <Values extends Record<string, any>>(
  initialValues: Values,
  validators: ValidatorsSetup<Values> = {},
) => {
  const [instance] = React.useState(() => {
    const inst = form<Values>(validators);
    inst.init(initialValues);
    return inst;
  });
  const [state, setState] = React.useState(instance.state);

  const set = React.useCallback(
    (values: Partial<Values>): void => {
      instance.set(values);
    },
    [instance],
  );

  const inject = React.useCallback(
    <Key extends keyof Values>(key: Key) => ({
      onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => {
        instance.set({
          [key]: e.target.value,
        } as Partial<Values>);
      },
      name: key,
      value: state.values[key],
    }),
    [state, instance],
  );

  React.useEffect(() => {
    const unsubscribe = instance.subscribe((_, state) => setState(state));

    return () => {
      unsubscribe();
    };
  }, [instance]);

  return [state, { set, inject }] as const;
};

export { useForm };
