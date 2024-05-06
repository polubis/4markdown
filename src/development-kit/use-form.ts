import React from 'react';
import { Formable, ValidatorsSetup, form } from './form';

const useForm = <Values extends Record<string, any>>(
  values: Values,
  validators: ValidatorsSetup<Values> = {},
) => {
  const [instance, setInstance] = React.useState(() => {
    const inst = form<Values>(validators);
    inst.init(values);
    return inst;
  });
  const [state, setState] = React.useState(instance.state);

  const set: Formable<Values>['set'] = React.useCallback(
    (values) => instance.set(values),
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

  const confirm: Formable<Values>['confirm'] = React.useCallback(
    () => instance.confirm(),
    [instance],
  );

  const restart = React.useCallback(
    (values: Values, validators: ValidatorsSetup<Values> = {}) => {
      const inst = form<Values>(validators);
      inst.init(values);
      setInstance(inst);

      return inst.state();
    },
    [],
  );

  React.useEffect(() => {
    const unsubscribe = instance.subscribe((_, state) => setState(state));

    return () => {
      unsubscribe();
    };
  }, [instance]);

  return [
    state,
    { set, restart, inject, confirm, subscribe: instance.subscribe },
  ] as const;
};

export { useForm };
