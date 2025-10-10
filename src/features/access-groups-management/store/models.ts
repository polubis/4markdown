import { API4MarkdownDto, ParsedError } from "api-4markdown-contracts";

type AccessGroupsManagementState = {
  view: "list" | "create";
  idle: boolean;
  busy: boolean;
  error: ParsedError | null;
  accessGroups: API4MarkdownDto<"getYourAccessGroups">["accessGroups"];
};

export type { AccessGroupsManagementState };
