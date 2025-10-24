import { getAPI } from "api-4markdown";
import { API4MarkdownDto, API4MarkdownPayload } from "api-4markdown-contracts";

const addResourceCommentAct = async (
  payload: API4MarkdownPayload<"addResourceComment">,
): Promise<API4MarkdownDto<"addResourceComment">> => {
  const addedComment = await getAPI().call("addResourceComment")(payload);
  return addedComment;
};

export { addResourceCommentAct };
