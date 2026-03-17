import { getAPI } from "api-4markdown";
import { API4MarkdownDto, API4MarkdownPayload } from "api-4markdown-contracts";

const addMindmapNodeCommentAct = async (
  payload: API4MarkdownPayload<"addMindmapNodeComment">,
): Promise<API4MarkdownDto<"addMindmapNodeComment">> => {
  return getAPI().call("addMindmapNodeComment")(payload);
};

export { addMindmapNodeCommentAct };
