import React from 'react';
import { report as makeReport, type ValidatorsMap } from './form';

const useForm = <Values extends Record<string, any>>(
  valuesInitializer: Values | (() => Values),
  validatorsInitializer:
    | ValidatorsMap<Values>
    | (() => ValidatorsMap<Values>) = {},
) => {
  const [validators, setValidators] = React.useState(validatorsInitializer);
  const [values, setValues] = React.useState(valuesInitializer);

  const set = React.useCallback(
    <Key extends keyof Values>(key: Key, value: Values[Key]): void => {
      setValues((prevValues) => ({
        ...prevValues,
        [key]: value,
      }));
    },
    [],
  );

  const patch = React.useCallback((values: Partial<Values>) => {
    setValues((prevValues) => ({
      ...prevValues,
      ...values,
    }));
  }, []);

  const reconfigure = React.useCallback(
    (validators: ValidatorsMap<Values> = {}): void => {
      setValidators(validators);
    },
    [],
  );

  const inject = React.useCallback(
    <Key extends keyof Values>(key: Key) => ({
      onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => {
        setValues((prevValues) => ({
          ...prevValues,
          [key]: e.target.value,
        }));
      },
      name: key,
      value: values[key],
    }),
    [values],
  );

  const report = React.useMemo(
    () => makeReport(values, validators),
    [values, validators],
  );

  return [
    { values, validators, ...report },
    { set, reconfigure, inject, patch },
  ] as const;
};

export { useForm };
