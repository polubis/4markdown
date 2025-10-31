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
  symbol: "unknown";
  content: string;
  message: string;
};

type NoInternetError = {
  symbol: "no-internet";
  content: string;
  message: string;
};

type ClientError = {
  symbol: "client-error";
  content: string;
  message: string;
};

type API4MarkdownError =
  | KnownError
  | UnknownError
  | NoInternetError
  | ClientError;

export type { API4MarkdownError };
