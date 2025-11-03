import type { API4MarkdownError } from "api-4markdown-contracts";

const parseError = (error: unknown): API4MarkdownError => {
  const unknownError: Extract<API4MarkdownError, { symbol: "unknown" }> = {
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
