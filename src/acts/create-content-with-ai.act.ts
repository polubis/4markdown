import { parseError } from 'api-4markdown';
import type {
  API4MarkdownDto,
  API4MarkdownPayload,
} from 'api-4markdown-contracts';
import { mock } from 'development-kit/mock';
import type { AsyncResult } from 'development-kit/utility-types';

const createContentWithAIAct = async (
  payload: API4MarkdownPayload<'createContentWithAI'>,
): AsyncResult<API4MarkdownDto<'createContentWithAI'>> => {
  try {
    // await getAPI().call(`createContentWithAI`)(payload);
    const data = await mock({ delay: 3, errorFactor: 100 })({
      output: `#my content
      #my content
      #my content
      #my content
      #my content
      #my content
      #my content
      #my content
      #my content
      #my content
      #my content
      #my content#my content
      #my content
      #my content
      #my content
      #my content
      #my content
      #my content
      #my content
      #my content
      #my content
      #my content
      #my content
      `.repeat(3),
    })(payload);

    return { is: `ok`, data };
  } catch (error: unknown) {
    return { is: `fail`, error: parseError(error) };
  }
};

export { createContentWithAIAct };
