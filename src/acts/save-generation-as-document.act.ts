import type { SUID } from 'development-kit/suid';
import { useDocumentGenerationState } from 'store/document-generation';
import { getAPI, setCache } from 'api-4markdown';
import { docManagementStoreActions } from 'store/doc-management/doc-management.store';
import { docStoreActions } from 'store/doc/doc.store';
import { docsStoreSelectors, docsStoreActions } from 'store/docs/docs.store';

import { markAsUnchangedAction } from 'store/document-creator/actions';

const saveGenerationAsDocumentAct = async (
  conversationId: SUID,
): Promise<void> => {
  try {
    const conversation = useDocumentGenerationState
      .get()
      .conversations.find((conversation) => conversation.id === conversationId);

    if (!conversation) {
      docManagementStoreActions.fail(
        new Error(
          JSON.stringify({
            symbol: `client-error`,
            content: `No conversation found`,
            message: `No conversation found`,
          }),
        ),
      );
      return;
    }

    const record = [...conversation.history].slice(-1)[0];

    if (record.type !== `assistant-reply`) {
      docManagementStoreActions.fail(
        new Error(
          JSON.stringify({
            symbol: `client-error`,
            content: `No assistant reply found`,
            message: `No assistant reply found`,
          }),
        ),
      );
      return;
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
  } catch (error: unknown) {
    docManagementStoreActions.fail(error);
  }
};

export { saveGenerationAsDocumentAct };
