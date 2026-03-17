import { getAPI } from "api-4markdown";
import type {
  API4MarkdownDto,
  API4MarkdownPayload,
} from "api-4markdown-contracts";

const submitDocumentContributionAct = async (
  payload: API4MarkdownPayload<"submitDocumentContribution">,
): Promise<API4MarkdownDto<"submitDocumentContribution">> => {
  return getAPI().call("submitDocumentContribution")(payload);
};

export { submitDocumentContributionAct };
