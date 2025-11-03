import { AccessGroupDto, API4MarkdownError } from "api-4markdown-contracts";

type AccessGroup = AccessGroupDto;

type AccessGroupsManagementState = {
  view: "list" | "form" | "members";
  idle: boolean;
  busy: boolean;
  error: API4MarkdownError | null;
  accessGroupToEdit: AccessGroup | null;
  accessGroups: AccessGroup[];
};

export type { AccessGroupsManagementState };
