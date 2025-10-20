import { getAPI } from "api-4markdown";
import { API4MarkdownDto, API4MarkdownPayload } from "api-4markdown-contracts";

const addAccessGroupMemberAct = (
  payload: API4MarkdownPayload<"addAccessGroupMember">,
): Promise<API4MarkdownDto<"addAccessGroupMember">> => {
  return getAPI().call("addAccessGroupMember")(payload);
};

export { addAccessGroupMemberAct };
