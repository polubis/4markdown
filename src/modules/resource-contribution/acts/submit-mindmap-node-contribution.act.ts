import { getAPI } from "api-4markdown";
import type {
  API4MarkdownDto,
  API4MarkdownPayload,
} from "api-4markdown-contracts";

const submitMindmapNodeContributionAct = async (
  payload: API4MarkdownPayload<"submitMindmapNodeContribution">,
): Promise<API4MarkdownDto<"submitMindmapNodeContribution">> => {
  return getAPI().call("submitMindmapNodeContribution")(payload);
};

export { submitMindmapNodeContributionAct };
