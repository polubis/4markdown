type NonNullableProperties<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

type Prettify<TObject> = {
  [Key in keyof TObject]: TObject[Key];
} & {};

type MaybeObject = Record<string | number | symbol, any> | undefined;

type Transaction<
  TOkData extends MaybeObject = undefined,
  TFailData extends MaybeObject = { error: string },
> =
  | { is: 'idle' }
  | { is: 'busy' }
  | (TOkData extends undefined ? { is: 'ok' } : { is: 'ok' } & TOkData)
  | (TFailData extends undefined ? { is: `fail` } : { is: `fail` } & TFailData);

type Nullable<T> = {
  [P in keyof T]: T[P] extends object ? Nullable<T[P]> | null : T[P] | null;
};

export type { NonNullableProperties, Prettify, Transaction, Nullable };
