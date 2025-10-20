import { getAPI } from "api-4markdown";
import { API4MarkdownDto } from "api-4markdown-contracts";

const getYourAccessGroupsAct = (): Promise<
  API4MarkdownDto<"getYourAccessGroups">
> => {
  return getAPI().call(`getYourAccessGroups`)({
    limit: 25,
    cursor: null,
  });
};

export { getYourAccessGroupsAct };
