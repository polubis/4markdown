import { chain } from './core';
import {
  ValidatorsSetup,
  ValuesBase,
  FormState,
  ValidationResult,
  FormSubscriber,
  FormSubscriberAction,
  Formable,
} from './defs';

export const form = <Values extends ValuesBase>(
  validatorsSetup: ValidatorsSetup<Values> = {},
): Formable<Values> => {
  const subscriptions = new Map<string, FormSubscriber<Values>>();

  let state: FormState<Values>;

  const validate = (
    values: Values,
  ): Pick<FormState<Values>, 'invalid' | 'valid' | 'result'> => {
    const result = {} as ValidationResult<Values>;
    let invalid = false;

    for (const key in values) {
      const value = values[key];
      const fns = validatorsSetup[key] ?? [];
      result[key] = chain(...fns)(value);

      if (result[key] !== null) {
        invalid = true;
      }
    }

    return { result, invalid, valid: !invalid };
  };

  const setState = (newState: FormState<Values>): FormState<Values> => {
    state = {
      ...state,
      ...newState,
    };

    return state;
  };

  const confirm = (
    confirmed: boolean,
  ): Pick<FormState<Values>, 'confirmed' | 'unconfirmed'> => {
    return {
      confirmed,
      unconfirmed: !confirmed,
    };
  };

  const touch = (
    touched: boolean,
  ): Pick<FormState<Values>, 'touched' | 'untouched'> => {
    return {
      touched,
      untouched: !touched,
    };
  };

  const notify = (action: FormSubscriberAction): void => {
    const keys = subscriptions.keys();

    for (const key of keys) {
      const fn = subscriptions.get(key);
      fn?.(action, state);
    }
  };

  return {
    init: (values) => {
      const newState = setState({
        values,
        ...validate(values),
        ...confirm(false),
        ...touch(false),
      });
      notify(`init`);

      return newState;
    },
    set: (values) => {
      const newValues = {
        ...state.values,
        ...values,
      };

      const newState = setState({
        ...state,
        values: newValues,
        ...validate(newValues),
        ...touch(true),
      });
      notify(`set`);

      return newState;
    },
    confirm: () => {
      const newState = setState({
        ...state,
        ...validate(state.values),
        ...confirm(true),
      });
      notify(`confirm`);

      return newState;
    },
    subscribe: (subscriber) => {
      const key = new Date().toISOString();
      subscriptions.set(key, subscriber);

      return () => {
        subscriptions.delete(key);
      };
    },
    state: () => state,
  };
};
