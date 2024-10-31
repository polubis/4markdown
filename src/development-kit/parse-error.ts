type ErrorSymbol =
  | `already-exists`
  | `unauthenticated`
  | `internal`
  | `invalid-schema`
  | `not-found`
  | `out-of-date`
  | `bad-request`
  | `unauthorized`;
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
type Unauthorized = ErrorVariant<`unauthorized`>;
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
  | Unauthorized
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

const parseError = (error: unknown): ParsedError => {
  const unknownError: UnknownError = {
    symbol: `unknown`,
    content: `Unknown error occured`,
    message: `Unknown error occured`,
  };

  if (!(error instanceof Error)) {
    return unknownError;
  }

  try {
    return JSON.parse(error.message);
  } catch {
    return unknownError;
  }
};

export type { ParsedError };
export { parseError };
