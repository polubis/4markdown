import { type SUID, suid } from 'development-kit/suid';
import {
  documentGenerationCancelSubject,
  documentGenerationSubject,
  useDocumentGenerationState,
} from '.';
import type {
  API4MarkdownDto,
  API4MarkdownPayload,
} from 'api-4markdown-contracts';

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
            message: `User asked for document generation`,
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
        : {
            ...conversation,
            opened: false,
          },
    ),
  });
};

const addAssistantReplyAction = (
  conversationId: SUID,
  body: API4MarkdownDto<'createContentWithAI'>,
): void => {
  set({
    conversations: get().conversations.map((conversation) =>
      conversation.id === conversationId
        ? {
            ...conversation,
            operation: { is: `ok` },
            history: [
              ...conversation.history,
              {
                id: suid(),
                type: `assistant-reply`,
                message: `my content`,
                body,
              },
            ],
          }
        : conversation,
    ),
  });
};

const closeConversationAction = (conversationId: SUID): void => {
  set({
    conversations: get().conversations.filter(
      (conversation) => conversation.id !== conversationId,
    ),
  });
  documentGenerationCancelSubject.next(conversationId);
};

const stopGenerationAction = (conversationId: SUID): void => {
  set({
    conversations: get().conversations.map((conversation) =>
      conversation.id === conversationId
        ? {
            ...conversation,
            history: [
              ...conversation.history,
              {
                id: suid(),
                type: `system-message`,
                message: `Generation stopped`,
              },
            ],
            operation: { is: `stopped` },
          }
        : conversation,
    ),
  });
  documentGenerationCancelSubject.next(conversationId);
};

export {
  startConversationAction,
  toggleConversationAction,
  addAssistantReplyAction,
  closeConversationAction,
  stopGenerationAction,
};
