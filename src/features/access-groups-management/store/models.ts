import { AccessGroupDto, ParsedError } from "api-4markdown-contracts";

type AccessGroup = AccessGroupDto;

type AccessGroupsManagementState = {
  view: "list" | "form" | "members";
  idle: boolean;
  busy: boolean;
  error: ParsedError | null;
  accessGroupToEdit: AccessGroup | null;
  accessGroups: AccessGroup[];
};

export type { AccessGroupsManagementState };
