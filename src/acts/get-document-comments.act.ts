import { getAPI, parseError } from 'api-4markdown';
import type { API4MarkdownPayload } from 'api-4markdown-contracts';
import { useDocumentCommentsState } from 'store/document-comments';

const getDocumentCommentsAct = async (
  payload: API4MarkdownPayload<'getDocumentComments'>,
): Promise<void> => {
  try {
    const { comments } = useDocumentCommentsState.get();

    if (comments.is === `busy` || comments.is === `ok`) return;

    useDocumentCommentsState.set({ comments: { is: `busy` } });

    const data = await getAPI().call(`getDocumentComments`)(payload);

    useDocumentCommentsState.set({ comments: { is: `ok`, data } });
  } catch (rawError: unknown) {
    const error = parseError(rawError);

    useDocumentCommentsState.set({ comments: { is: `fail`, error } });
  }
};

export { getDocumentCommentsAct };
