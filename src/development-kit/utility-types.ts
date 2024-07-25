type NonNullableProperties<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

type Prettify<TObject> = {
  [Key in keyof TObject]: TObject[Key];
} & {};

type Transaction<
  T extends Record<string | number | symbol, unknown> | undefined = undefined,
> =
  | { is: 'idle' }
  | { is: 'busy' }
  | (T extends undefined ? { is: 'ok' } : { is: 'ok' } & T)
  | { is: 'fail'; error: string };

type Nullable<T> = {
  [P in keyof T]: T[P] extends object ? Nullable<T[P]> | null : T[P] | null;
};

export type { NonNullableProperties, Prettify, Transaction, Nullable };
