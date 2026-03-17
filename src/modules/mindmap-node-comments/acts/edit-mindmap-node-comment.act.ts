import { getAPI } from "api-4markdown";
import { API4MarkdownDto, API4MarkdownPayload } from "api-4markdown-contracts";

const editMindmapNodeCommentAct = async (
  payload: API4MarkdownPayload<"editMindmapNodeComment">,
): Promise<API4MarkdownDto<"editMindmapNodeComment">> => {
  return getAPI().call("editMindmapNodeComment")(payload);
};

export { editMindmapNodeCommentAct };
