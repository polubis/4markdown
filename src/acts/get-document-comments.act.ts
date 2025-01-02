import { getAPI, parseError } from 'api-4markdown';
import type {
  API4MarkdownDto,
  API4MarkdownPayload,
} from 'api-4markdown-contracts';
import type { AsyncResult } from 'development-kit/utility-types';
import { useDocumentCommentsState } from 'store/document-comments';

const getDocumentCommentsAct = async (
  payload: API4MarkdownPayload<'getDocumentComments'>,
): AsyncResult<API4MarkdownDto<'getDocumentComments'>> => {
  try {
    useDocumentCommentsState.set({ comments: { is: `busy` } });

    const data = await getAPI().call(`getDocumentComments`)(payload);

    useDocumentCommentsState.set({ comments: { is: `ok`, data } });

    return { is: `ok`, data };
  } catch (rawError: unknown) {
    const error = parseError(rawError);

    useDocumentCommentsState.set({ comments: { is: `fail`, error } });

    return { is: `fail`, error };
  }
};

export { getDocumentCommentsAct };
