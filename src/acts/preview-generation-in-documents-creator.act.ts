import type { SUID } from 'development-kit/suid';
import { useDocumentGenerationState } from 'store/document-generation';
import { seeInDocumentsCreatorAct } from './see-in-documents-creator.act';

const previewGenerationInDocumentsCreatorAct = (conversationId: SUID): void => {
  const conversation = useDocumentGenerationState
    .get()
    .conversations.find((conversation) => conversation.id === conversationId);

  if (!conversation) {
    return;
  }

  if (!conversation) {
    return;
  }

  const record = [...conversation.history].slice(-1)[0];

  if (record.type !== `assistant-reply`) {
    return;
  }

  seeInDocumentsCreatorAct({ code: record.body.output });
};

export { previewGenerationInDocumentsCreatorAct };
