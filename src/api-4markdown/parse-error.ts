import type { ParsedError, UnknownError } from "api-4markdown-contracts";

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

export { parseError };
