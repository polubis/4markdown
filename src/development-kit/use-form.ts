import React from 'react';
import { ValidatorsSetup, form } from './form/';

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

  React.useEffect(() => {
    const unsubscribe = instance.subscribe((_, state) => setState(state));

    return () => {
      unsubscribe();
    };
  }, [instance]);

  return [state] as const;
};

export { useForm };
