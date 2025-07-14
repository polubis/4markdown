import { getAPI, parseError } from "api-4markdown";
import type {
  API4MarkdownDto,
  API4MarkdownPayload,
} from "api-4markdown-contracts";
import { type AsyncResult } from "development-kit/utility-types";
import { updateTokensAct } from "./update-tokens.act";

const rewriteWithAssistantAct = async (
  payload: API4MarkdownPayload<"rewriteWithAssistant">,
): AsyncResult<API4MarkdownDto<"rewriteWithAssistant">> => {
  try {
    const data = await getAPI().call(`rewriteWithAssistant`)(payload);

    updateTokensAct(data.tokensAfter);

    return { is: `ok`, data };
  } catch (error) {
    return { is: `fail`, error: parseError(error) };
  }
};

export { rewriteWithAssistantAct };
