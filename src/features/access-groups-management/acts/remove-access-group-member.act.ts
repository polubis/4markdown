import { getAPI } from "api-4markdown";
import { API4MarkdownDto, API4MarkdownPayload } from "api-4markdown-contracts";

const removeAccessGroupMemberAct = async (
  payload: API4MarkdownPayload<"removeAccessGroupMember">,
): Promise<API4MarkdownDto<"removeAccessGroupMember">> => {
  return await getAPI().call("removeAccessGroupMember")(payload);
};

export { removeAccessGroupMemberAct };
