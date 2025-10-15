import { getAPI } from "api-4markdown";
import { API4MarkdownDto, API4MarkdownPayload } from "api-4markdown-contracts";

const getAccessGroupAct = async (
  payload: API4MarkdownPayload<"getAccessGroup">,
): Promise<API4MarkdownDto<"getAccessGroup">> => {
  console.log(`siema`);
  return await getAPI().call("getAccessGroup")(payload);
};

export { getAccessGroupAct };
