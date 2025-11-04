import { getAPI } from "api-4markdown";
import { API4MarkdownDto, API4MarkdownPayload } from "api-4markdown-contracts";

const rateDocumentCommentAct = async (
  payload: API4MarkdownPayload<"rateDocumentComment">,
): Promise<API4MarkdownDto<"rateDocumentComment">> => {
  return getAPI().call("rateDocumentComment")(payload);
};

export { rateDocumentCommentAct };
