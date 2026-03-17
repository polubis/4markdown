import { getAPI } from "api-4markdown";
import { API4MarkdownDto, API4MarkdownPayload } from "api-4markdown-contracts";

const deleteMindmapNodeCommentAct = async (
  payload: API4MarkdownPayload<"deleteMindmapNodeComment">,
): Promise<API4MarkdownDto<"deleteMindmapNodeComment">> => {
  return getAPI().call("deleteMindmapNodeComment")(payload);
};

export { deleteMindmapNodeCommentAct };
