import { getAPI } from "api-4markdown";
import { API4MarkdownDto, API4MarkdownPayload } from "api-4markdown-contracts";

const rateMindmapNodeCommentAct = async (
  payload: API4MarkdownPayload<"rateMindmapNodeComment">,
): Promise<API4MarkdownDto<"rateMindmapNodeComment">> => {
  return getAPI().call("rateMindmapNodeComment")(payload);
};

export { rateMindmapNodeCommentAct };
