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

const closeConversationAction = (id: SUID): void => {
  set({
    conversations: get().conversations.filter(
      (conversation) => conversation.id !== id,
    ),
  });
  documentGenerationCancelSubject.next(id);
};

export {
  startConversationAction,
  toggleConversationAction,
  addAssistantReplyAction,
  closeConversationAction,
};
