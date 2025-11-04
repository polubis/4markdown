import { getAPI } from "api-4markdown";
import { API4MarkdownDto, API4MarkdownPayload } from "api-4markdown-contracts";

const deleteDocumentCommentAct = async (
  payload: API4MarkdownPayload<"deleteDocumentComment">,
): Promise<API4MarkdownDto<"deleteDocumentComment">> => {
  return getAPI().call("deleteDocumentComment")(payload);
};

export { deleteDocumentCommentAct };
