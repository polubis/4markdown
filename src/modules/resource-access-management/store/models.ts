import { API4MarkdownDto, ParsedError } from "api-4markdown-contracts";

type ResourceAccessState = {
  loading: boolean;
  error: ParsedError | null;
  busy: boolean;
  phrase: string;
  access: API4MarkdownDto<"getResourceAccessInfoAct">["userProfiles"];
};

export type { ResourceAccessState };
