import { getAPI, parseError } from 'api-4markdown';
import type { API4MarkdownPayload } from 'api-4markdown-contracts';
import { useDocumentCommentsState } from 'store/document-comments';

const addDocumentCommentsAct = async (
  payload: API4MarkdownPayload<'addDocumentComment'>,
): Promise<void> => {
  try {
    const { comments } = useDocumentCommentsState.get();

    if (comments.is !== `ok`) throw Error(`Cannot add comment`);

    useDocumentCommentsState.set({ updating: { is: `busy` } });

    const addedComment = await getAPI().call(`addDocumentComment`)(payload);

    useDocumentCommentsState.set({
      updating: { is: `idle` },
      comments: {
        ...comments,
        data: [addedComment, ...comments.data],
      },
    });
  } catch (rawError: unknown) {
    const error = parseError(rawError);

    useDocumentCommentsState.set({ updating: { is: `fail`, error } });
  }
};

export { addDocumentCommentsAct };
