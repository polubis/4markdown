import { getAPI } from "api-4markdown";
import { API4MarkdownDto, API4MarkdownPayload } from "api-4markdown-contracts";

const loadResourceCommentsAct = async (
  payload: API4MarkdownPayload<"getResourceComments">,
): Promise<API4MarkdownDto<"getResourceComments">> => {
  const comments = await getAPI().call("getResourceComments")(payload);
  return comments;
};

export { loadResourceCommentsAct };
