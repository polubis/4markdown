import { getAPI, parseError } from 'api-4markdown';
import type {
  API4MarkdownDto,
  API4MarkdownPayload,
} from 'api-4markdown-contracts';
import type { AsyncResult } from 'development-kit/utility-types';

const createContentWithAIAct = async (
  payload: API4MarkdownPayload<'createContentWithAI'>,
): AsyncResult<API4MarkdownDto<'createContentWithAI'>> => {
  try {
    const data = await getAPI().call(`createContentWithAI`)(payload);
    return { is: `ok`, data };
  } catch (error: unknown) {
    return { is: `fail`, error: parseError(error) };
  }
};

export { createContentWithAIAct };
