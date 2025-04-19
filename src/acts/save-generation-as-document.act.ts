import type { SUID } from 'development-kit/suid';
import { useDocumentGenerationState } from 'store/document-generation';
import type { AsyncResult } from 'development-kit/utility-types';
import { getAPI, parseError, setCache } from 'api-4markdown';
import { docManagementStoreActions } from 'store/doc-management/doc-management.store';
import { docStoreActions } from 'store/doc/doc.store';
import { docsStoreSelectors, docsStoreActions } from 'store/docs/docs.store';

import { markAsUnchangedAction } from 'store/document-creator/actions';

const saveGenerationAsDocumentAct = async (
  conversationId: SUID,
): AsyncResult => {
  try {
    const conversation = useDocumentGenerationState
      .get()
      .conversations.find((conversation) => conversation.id === conversationId);

    if (!conversation) {
      return {
        is: `fail`,
        error: {
          symbol: `client-error`,
          content: `No conversation found`,
          message: `No conversation found`,
        },
      };
    }

    const record = [...conversation.history].slice(-1)[0];

    if (record.type !== `assistant-reply`) {
      return {
        is: `fail`,
        error: {
          symbol: `client-error`,
          content: `No assistant reply found`,
          message: `No assistant reply found`,
        },
      };
    }

    const code = record.body.output;

    docManagementStoreActions.busy();

    const createdDocument = await getAPI().call(`createDocument`)({
      name: conversation.payload.name,
      code,
    });

    docManagementStoreActions.ok();
    docStoreActions.setActive(createdDocument);
    docsStoreActions.addDoc(createdDocument);
    markAsUnchangedAction();

    setCache(`getYourDocuments`, docsStoreSelectors.ok().docs);

    return { is: `ok` };
  } catch (rawError: unknown) {
    const error = parseError(rawError);

    docManagementStoreActions.fail(error);

    return { is: `fail`, error };
  }
};

export { saveGenerationAsDocumentAct };
