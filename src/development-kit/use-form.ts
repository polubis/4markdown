import { type ChangeEvent, useCallback, useEffect, useState } from 'react';
import type { Formable, ValidatorsSetup } from './form';
import { form } from './form';

const useForm = <Values extends Record<string, any>>(
  values: Values,
  validators: ValidatorsSetup<Values> = {},
) => {
  const [instance] = useState(() => {
    const inst = form<Values>(validators);
    inst.init(values);
    return inst;
  });
  const [state, setState] = useState(instance.state);

  const set: Formable<Values>['set'] = useCallback(
    (values) => instance.set(values),
    [instance],
  );

  const inject = useCallback(
    <Key extends keyof Values>(key: Key) => ({
      onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        instance.set({
          [key]: e.target.value,
        } as Partial<Values>);
      },
      name: key,
      value: state.values[key],
    }),
    [state, instance],
  );

  const confirm: Formable<Values>['confirm'] = useCallback(
    () => instance.confirm(),
    [instance],
  );

  const reconfigure: Formable<Values>['reconfigure'] = useCallback(
    (values, validators) => instance.reconfigure(values, validators),
    [instance],
  );

  const reset: Formable<Values>['reset'] = useCallback(
    (values) => instance.reset(values),
    [instance],
  );

  useEffect(() => {
    const unsubscribe = instance.subscribe((_, state) => setState(state));

    return () => {
      unsubscribe();
    };
  }, [instance]);

  return [
    state,
    { set, reconfigure, inject, reset, confirm, subscribe: instance.subscribe },
  ] as const;
};

export { useForm };
