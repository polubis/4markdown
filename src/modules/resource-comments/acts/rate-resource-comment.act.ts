import { getAPI } from "api-4markdown";
import { API4MarkdownDto, API4MarkdownPayload } from "api-4markdown-contracts";

const rateResourceCommentAct = async (
  payload: API4MarkdownPayload<"rateResourceComment">,
): Promise<API4MarkdownDto<"rateResourceComment">> => {
  const ratedComment = await getAPI().call("rateResourceComment")(payload);
  return ratedComment;
};

export { rateResourceCommentAct };
