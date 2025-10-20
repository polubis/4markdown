import { getAPI } from "api-4markdown";
import { API4MarkdownDto, API4MarkdownPayload } from "api-4markdown-contracts";

const removeAccessGroupAct = (
  payload: API4MarkdownPayload<"removeAccessGroup">,
): Promise<API4MarkdownDto<"removeAccessGroup">> => {
  return getAPI().call("removeAccessGroup")(payload);
};

export { removeAccessGroupAct };
