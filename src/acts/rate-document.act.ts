import { getAPI, parseError } from 'api-4markdown';
import type {
  API4MarkdownDto,
  API4MarkdownPayload,
} from 'api-4markdown-contracts';
import type { AsyncResult } from 'development-kit/utility-types';

const rateDocumentAct = async (
  payload: API4MarkdownPayload<'rateDocument'>,
): AsyncResult<API4MarkdownDto<'rateDocument'>> => {
  try {
    const data = await getAPI().call(`rateDocument`)(payload);
    return { is: `ok`, data };
  } catch (rawError: unknown) {
    const error = parseError(rawError);
    return { is: `fail`, error };
  }
};

export { rateDocumentAct };
