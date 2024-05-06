import { ValidatorResult } from './defs';

export const minLength =
  (limit: number) =>
  (value: string | unknown[]): ValidatorResult<'minLength'> =>
    value.length >= limit ? null : `minLength`;

export const maxLength =
  (limit: number) =>
  (value: string | unknown[]): ValidatorResult<'maxLength'> =>
    value.length <= limit ? null : `maxLength`;

export const noEdgeSpaces = (value: string): ValidatorResult<'noEdgeSpaces'> =>
  value.trim().length === value.length ? null : `noEdgeSpaces`;

export const nonNullable = <T>(value: T): ValidatorResult<'nonNullable'> =>
  value !== undefined && value !== null ? null : `nonNullable`;

export const notEmpty = (value: string): ValidatorResult<'notEmpty'> =>
  value.trim().length > 0 ? null : `notEmpty`;

export const url = (value: string): ValidatorResult<'url'> =>
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/.test(
    value,
  )
    ? null
    : `url`;

export const nickname = (value: string): ValidatorResult<'nickname'> =>
  /^[a-zA-Z0-9_-]+$/.test(value) ? null : `nickname`;

const chain =
  (...validators: ((value: any) => ValidatorResult<string>)[]) =>
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
