import { getAPI } from "api-4markdown";
import { API4MarkdownDto, API4MarkdownPayload } from "api-4markdown-contracts";

const editResourceCommentAct = async (
  payload: API4MarkdownPayload<"editResourceComment">,
): Promise<API4MarkdownDto<"editResourceComment">> => {
  const editedComment = await getAPI().call("editResourceComment")(payload);
  return editedComment;
};

export { editResourceCommentAct };
