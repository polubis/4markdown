import { ValidatorFn, ValidatorResult } from './defs';

export const minLength =
  (limit: number): ValidatorFn<string | unknown[], 'minLength'> =>
  (value) =>
    value.length >= limit ? null : `minLength`;

export const maxLength =
  (limit: number): ValidatorFn<string | unknown[], 'maxLength'> =>
  (value) =>
    value.length <= limit ? null : `maxLength`;

export const noEdgeSpaces: ValidatorFn<string, 'noEdgeSpaces'> = (value) =>
  value.trim().length === value.length ? null : `noEdgeSpaces`;

export const notEmpty: ValidatorFn<string, 'notEmpty'> = (value) =>
  value.trim().length > 0 ? null : `notEmpty`;

export const url: ValidatorFn<string, 'url'> = (value) =>
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/.test(
    value,
  )
    ? null
    : `url`;

export const nickname: ValidatorFn<string, 'nickname'> = (value) =>
  /^[a-zA-Z0-9_-]+$/.test(value) ? null : `nickname`;

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
