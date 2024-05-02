const isString = (value: unknown): value is string => typeof value === `string`;

const noEdgeSpaces = (value: string): boolean =>
  value.trim().length === value.length;

const nonNullable = <T>(value: T): value is NonNullable<T> =>
  value !== undefined && value !== null;

const notEmpty = (value: string): boolean => value.trim().length > 0;

const minLength =
  (limit: number) =>
  (value: string | any[]): boolean =>
    value.length >= limit;

const maxLength =
  (limit: number) =>
  (value: string | any[]): boolean =>
    value.length <= limit;

const chain =
  (...validators: ((value: any) => boolean)[]) =>
  (value: any): boolean => {
    for (const validator of validators) {
      if (!validator(value)) return false;
    }

    return true;
  };

const nickname = (value: string): boolean => /^[a-zA-Z0-9_-]+$/.test(value);

export {
  chain,
  isString,
  noEdgeSpaces,
  notEmpty,
  nonNullable,
  minLength,
  maxLength,
  nickname,
};
