type ListErrorContent = { key: string; message: string }[];
type ErrorContent = string | ListErrorContent;

type ErrorVariant<
  TSymbol extends string,
  TContent extends ErrorContent = string,
> = {
  symbol: TSymbol;
  content: TContent;
  message: string;
};

type ServerError =
  | ErrorVariant<`already-exists`>
  | ErrorVariant<`unauthenticated`>
  | ErrorVariant<`unauthorized`>
  | ErrorVariant<`internal`>
  | ErrorVariant<`invalid-schema`, ListErrorContent>
  | ErrorVariant<`not-found`>
  | ErrorVariant<`out-of-date`>
  | ErrorVariant<`bad-request`>;

type ClientError =
  | ErrorVariant<`unknown`>
  | ErrorVariant<`no-internet`>
  | ErrorVariant<`custom-error`>;

type API4MarkdownError = ClientError | ServerError;

export type { API4MarkdownError };
