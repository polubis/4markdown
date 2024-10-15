const symbols = [
  `already-exists`,
  `unauthenticated`,
  `internal`,
  `invalid-schema`,
  `not-found`,
  `out-of-date`,
  `bad-request`,
] as const;

type ErrorSymbol = (typeof symbols)[number];
type ErrorContent = string | { key: string; message: string }[];

type ErrorVariant<
  TSymbol extends ErrorSymbol,
  TContent extends ErrorContent = string,
> = {
  symbol: TSymbol;
  content: TContent;
  message: string;
};

// @TODO[PRIO=2]: [Move errors type defs to contracts library].
type AlreadyExistsError = ErrorVariant<`already-exists`>;
type UnauthenticatedError = ErrorVariant<`unauthenticated`>;
type InternalError = ErrorVariant<`internal`>;
type InvalidSchemaError = ErrorVariant<
  `invalid-schema`,
  { key: string; message: string }[]
>;
type NotFoundError = ErrorVariant<`not-found`>;
type OutOfDateError = ErrorVariant<`out-of-date`>;
type BadRequestError = ErrorVariant<`bad-request`>;

type KnownError =
  | AlreadyExistsError
  | UnauthenticatedError
  | InternalError
  | InvalidSchemaError
  | NotFoundError
  | OutOfDateError
  | BadRequestError;

type UnknownError = {
  symbol: 'unknown';
  content: string;
  message: string;
};

type ParsedError = KnownError | UnknownError;

const isParsedError = (error: unknown): error is KnownError =>
  typeof error === `object` && (error as Error).name === `FirebaseError`;

const parseError = (error: unknown): ParsedError => {
  if (isParsedError(error)) {
    return error;
  }

  return {
    symbol: `unknown`,
    content: `Unknown error occured`,
    message: `Unknown error occured`,
  };
};

export type { ParsedError };
export { parseError };
