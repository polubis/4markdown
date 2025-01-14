import type { ParsedError } from 'api-4markdown-contracts';

type NonNullableProperties<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

type Prettify<TObject> = {
  [Key in keyof TObject]: TObject[Key];
} & {};

type MaybeObject = Record<string | number | symbol, any> | undefined;

// @TODO[PRIO=4]: [Decouple this ParsedError from this place].
type Transaction<
  TOkData extends MaybeObject = undefined,
  TFailData extends MaybeObject = { error: ParsedError },
> =
  | { is: 'idle' }
  | { is: 'busy' }
  | (TOkData extends undefined ? { is: 'ok' } : { is: 'ok' } & TOkData)
  | (TFailData extends undefined ? { is: `fail` } : { is: `fail` } & TFailData);

type Nullable<T> = {
  [P in keyof T]: T[P] extends object ? Nullable<T[P]> | null : T[P] | null;
};

type AsyncResult<
  TOkData extends MaybeObject = undefined,
  TFailData extends MaybeObject = { error: ParsedError },
> = Promise<
  | (TOkData extends undefined ? { is: 'ok' } : { is: 'ok'; data: TOkData })
  | (TFailData extends undefined ? { is: `fail` } : { is: `fail` } & TFailData)
>;

type Result<
  TOkData extends MaybeObject = undefined,
  TFailData extends MaybeObject = { error: ParsedError },
> = Awaited<AsyncResult<TOkData, TFailData>>;

export type {
  NonNullableProperties,
  Prettify,
  Transaction,
  Nullable,
  AsyncResult,
  Result,
};
