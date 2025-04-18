import { type SUID, suid } from 'development-kit/suid';
import { documentGenerationSubject, useDocumentGenerationState } from '.';
import type { API4MarkdownPayload } from 'api-4markdown-contracts';

const { get, set } = useDocumentGenerationState;

const startConversationAction = (
  payload: API4MarkdownPayload<'createContentWithAI'>,
): void => {
  const conversationId = suid();

  set({
    conversations: [
      ...get().conversations,
      {
        id: conversationId,
        opened: false,
        history: [
          {
            id: suid(),
            type: `user-started`,
            message: `User asked me to generate document`,
            payload,
          },
        ],
        operation: { is: `busy` },
        payload,
      },
    ],
  });
  documentGenerationSubject.next({
    payload,
    conversationId,
  });
};

const toggleConversationAction = (id: SUID): void => {
  set({
    conversations: get().conversations.map((conversation) =>
      conversation.id === id
        ? { ...conversation, opened: !conversation.opened }
        : conversation,
    ),
  });
};

export { startConversationAction, toggleConversationAction };
