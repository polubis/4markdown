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
};

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

type ParsedError =
  | KnownError
  | {
      symbol: 'unknown';
      content: string;
    };

const parseErrorV2 = (error: unknown): ParsedError => {
  const unknownError: ParsedError = {
    symbol: `unknown`,
    content: `Unknown error occured`,
  };

  if (typeof error !== `string`) {
    return unknownError;
  }

  try {
    const { symbol, content } = JSON.parse(error) as KnownError;

    if (!content || !symbol) {
      return unknownError;
    }

    if (!symbols.includes(symbol)) {
      return unknownError;
    }

    if (
      symbol === `invalid-schema` &&
      (!Array.isArray(content) ||
        content.length === 0 ||
        content.some(
          (reason) =>
            typeof reason.key !== `string` ||
            typeof reason.message !== `string`,
        ))
    ) {
      return unknownError;
    }

    return { symbol, content } as ParsedError;
  } catch {
    return unknownError;
  }
};

export type { ParsedError };
export { parseErrorV2 };
