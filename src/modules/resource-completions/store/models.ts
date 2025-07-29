import { API4MarkdownDto } from "api-4markdown-contracts";
import { Transaction } from "development-kit/utility-types";

type ResourcesCompletionState = Transaction<{
  data: API4MarkdownDto<"getUserResourceCompletions">;
}>;

type OkResourcesCompletionState = Extract<
  ResourcesCompletionState,
  { is: `ok` }
>;

export type { ResourcesCompletionState, OkResourcesCompletionState };
