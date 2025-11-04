import { getAPI } from "api-4markdown";
import { API4MarkdownDto, API4MarkdownPayload } from "api-4markdown-contracts";

const editDocumentCommentAct = async (
  payload: API4MarkdownPayload<"editDocumentComment">,
): Promise<API4MarkdownDto<"editDocumentComment">> => {
  return getAPI().call("editDocumentComment")(payload);
};

export { editDocumentCommentAct };
