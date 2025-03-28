import { getAPI, parseError } from 'api-4markdown';
import type {
  API4MarkdownDto,
  API4MarkdownPayload,
} from 'api-4markdown-contracts';
import type { AsyncResult } from 'development-kit/utility-types';

const rewriteWithAssistantAct = async (
  payload: API4MarkdownPayload<`rewriteWithAssistant`>,
): AsyncResult<API4MarkdownDto<`rewriteWithAssistant`>> => {
  try {
    const answer = await getAPI().call(`rewriteWithAssistant`)(payload);

    return { is: `ok`, data: answer };
  } catch (error: unknown) {
    return { is: `fail`, error: parseError(error) };
  }
};

export { rewriteWithAssistantAct };
