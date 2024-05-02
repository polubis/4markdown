const isString = (value: unknown): value is string => typeof value === `string`;

const noEdgeSpaces = (value: string): boolean =>
  value.trim().length === value.length;

const nonNullable = <T>(value: T): value is NonNullable<T> =>
  value !== undefined && value !== null;

const notEmpty = (value: string): boolean => value.trim().length > 0;

const url = (value: string) =>
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/.test(
    value,
  );

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

type ValidatorsMap<Values extends Record<string, any>> = {
  [K in keyof Values]?: (value: Values[K]) => boolean;
};

type ValidationReport<Values extends Record<string, any>> = {
  ok: boolean;
  nok: boolean;
  result: Record<keyof Values, boolean>;
};

const report = <Values extends Record<string, any>>(
  values: Values,
  validators: ValidatorsMap<Values> = {},
): ValidationReport<Values> => {
  const result = {} as ValidationReport<Values>['result'];

  for (const key in values) {
    const validator = validators[key] ?? (() => true);
    result[key] = validator(values[key]);
  }

  for (const status in result) {
    if (!status) {
      return {
        result,
        ok: false,
        nok: true,
      };
    }
  }

  const nok = Object.values(result).some((status) => !status);

  return {
    result,
    ok: !nok,
    nok,
  };
};

const nickname = (value: string): boolean => /^[a-zA-Z0-9_-]+$/.test(value);

export type { ValidatorsMap, ValidationReport };
export {
  chain,
  isString,
  noEdgeSpaces,
  notEmpty,
  nonNullable,
  minLength,
  maxLength,
  nickname,
  report,
  url,
};
