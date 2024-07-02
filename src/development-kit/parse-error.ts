import { type z, literal, object, string, union } from 'zod';

const parseError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  return `Ups, something went wrong. Try again.`;
};

const schema = union([
  object({
    symbol: literal(`already-exists`),
    content: string().min(1),
  }),
  object({
    symbol: literal(`unauthenticated`),
    content: string().min(1),
  }),
  object({
    symbol: literal(`internal`),
    content: string().min(1),
  }),
  object({
    symbol: literal(`invalid-schema`),
    content: object({
      key: string().min(1),
      message: string().min(1),
    }),
  }),
  object({
    symbol: literal(`not-found`),
    content: string().min(1),
  }),
  object({
    symbol: literal(`out-of-date`),
    content: string().min(1),
  }),
  object({
    symbol: literal(`bad-request`),
    content: string().min(1),
  }),
]);

type ParsedError =
  | z.infer<typeof schema>
  | {
      symbol: `unknown`;
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

  const result = schema.safeParse(JSON.parse(error));

  if (!result.success) return unknownError;

  return result.data;
};

export type { ParsedError };
export { parseError, parseErrorV2 };
