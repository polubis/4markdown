import { getAPI } from "api-4markdown";
import { API4MarkdownDto, API4MarkdownPayload } from "api-4markdown-contracts";

const deleteResourceCommentAct = async (
  payload: API4MarkdownPayload<"deleteResourceComment">,
): Promise<API4MarkdownDto<"deleteResourceComment">> => {
  return await getAPI().call("deleteResourceComment")(payload);
};

export { deleteResourceCommentAct };
