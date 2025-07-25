import { API4MarkdownDto, ParsedError } from "api-4markdown-contracts";

type ResourcesCompletionState = {
  idle: boolean;
  busy: boolean;
  error: ParsedError | null;
  completions: API4MarkdownDto<"getUserResourceCompletions">;
};

export type { ResourcesCompletionState };
