import { ValidatorFn, ValidatorResult } from './defs';

export const chain =
  (...validators: ValidatorFn<any, string>[]) =>
  (value: any): ValidatorResult<string> => {
    for (const validator of validators) {
      const result = validator(value);
      if (result) return result;
    }

    return null;
  };

export const optional =
  (...validators: ((value: any) => ValidatorResult<string>)[]) =>
  (value: any): ValidatorResult<string> => {
    if (value === `` || value === undefined || value === null) return null;

    return chain(...validators)(value);
  };

export const validator =
  <ReturnLiteral extends string, ValueType>(
    literal: ReturnLiteral,
    predicate: (value: ValueType) => boolean,
  ) =>
  (value: ValueType): ValidatorResult<ReturnLiteral> =>
    predicate(value) ? null : literal;
