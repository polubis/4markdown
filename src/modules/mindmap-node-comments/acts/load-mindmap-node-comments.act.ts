import { getAPI } from "api-4markdown";
import { API4MarkdownDto, API4MarkdownPayload } from "api-4markdown-contracts";

const loadMindmapNodeCommentsAct = async (
  payload: API4MarkdownPayload<"getMindmapNodeComments">,
): Promise<API4MarkdownDto<"getMindmapNodeComments">> => {
  return getAPI().call("getMindmapNodeComments")(payload);
};

export { loadMindmapNodeCommentsAct };
