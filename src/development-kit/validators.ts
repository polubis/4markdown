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

const report =
  <V extends Record<string, any>>(
    validators: Partial<Record<keyof V, (value: any) => boolean>>,
  ) =>
  (
    values: V,
  ): {
    result: Record<keyof V, boolean>;
    ok: boolean;
    nok: boolean;
  } => {
    const result = {} as Record<keyof V, boolean>;
    let ok = true;

    for (const key in values) {
      const validator = validators[key] ?? (() => true);
      result[key] = validator(values[key]);
    }

    for (const status in result) {
      if (!status) {
        ok = false;
        break;
      }
    }

    return {
      result,
      ok,
      nok: !ok,
    };
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
  report,
};
