import { getAPI } from "api-4markdown";
import { API4MarkdownDto, API4MarkdownPayload } from "api-4markdown-contracts";

const loadDocumentCommentsAct = async (
  payload: API4MarkdownPayload<"getDocumentComments">,
): Promise<API4MarkdownDto<"getDocumentComments">> => {
  return getAPI().call("getDocumentComments")(payload);
};

export { loadDocumentCommentsAct };
