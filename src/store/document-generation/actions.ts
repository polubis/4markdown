import { type SUID, suid } from 'development-kit/suid';
import {
  documentGenerationCancelSubject,
  documentGenerationSubject,
  useDocumentGenerationState,
} from '.';
import type {
  API4MarkdownDto,
  API4MarkdownPayload,
  ParsedError,
} from 'api-4markdown-contracts';

const { get, set } = useDocumentGenerationState;

const startConversationAction = (
  payload: API4MarkdownPayload<'createContentWithAI'>,
): void => {
  const conversationId = suid();

  set({
    conversations: [
      {
        id: conversationId,
        opened: false,
        history: [
          {
            id: suid(),
            type: `user`,
            message: `Generate me a document based on provided parameters`,
            payload,
          },
        ],
        operation: { is: `busy` },
      },
      ...get().conversations,
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
                type: `system`,
                message: `Here is your document`,
              },
              {
                id: suid(),
                type: `assistant`,
                body,
              },
            ],
          }
        : conversation,
    ),
  });
};

const addAssistantErrorAction = (
  conversationId: SUID,
  error: ParsedError,
): void => {
  set({
    conversations: get().conversations.map((conversation) =>
      conversation.id === conversationId
        ? {
            ...conversation,
            operation: { is: `fail`, error },
          }
        : conversation,
    ),
  });
};

const closeConversationAction = (conversationId: SUID): void => {
  documentGenerationCancelSubject.next(conversationId);
  set({
    conversations: get().conversations.filter(
      (conversation) => conversation.id !== conversationId,
    ),
  });
};

const retryGenerationAction = (conversationId: SUID): void => {
  const conversation = get().conversations.find(
    (conversation) => conversation.id === conversationId,
  );

  if (!conversation) {
    throw Error(`Conversation not found. Something went wrong`);
  }

  set({
    conversations: get().conversations.map((conversation) =>
      conversation.id === conversationId
        ? {
            ...conversation,
            operation: { is: `busy` },
          }
        : conversation,
    ),
  });

  const payload = [...conversation.history]
    .reverse()
    .find((record) => record.type === `user`)?.payload;

  if (!payload) {
    throw Error(`Cannot find payload for conversation ${conversationId}`);
  }

  documentGenerationSubject.next({
    payload,
    conversationId,
  });
};

const stopGenerationAction = (conversationId: SUID): void => {
  documentGenerationCancelSubject.next(conversationId);

  set({
    conversations: get().conversations.map((conversation) =>
      conversation.id === conversationId
        ? {
            ...conversation,
            history: [
              ...conversation.history,
              {
                id: suid(),
                type: `system`,
                message: `Generation stopped`,
              },
            ],
            operation: { is: `idle` },
          }
        : conversation,
    ),
  });
};

const modifyGenerationPayloadAction = (
  conversationId: SUID,
  payload: API4MarkdownPayload<'createContentWithAI'>,
): void => {
  set({
    conversations: get().conversations.map((conversation) =>
      conversation.id === conversationId
        ? {
            ...conversation,
            history: [
              ...conversation.history,
              {
                id: suid(),
                type: `user`,
                message: `Generation parameters modified`,
                payload,
              },
            ],
            operation: { is: `busy` },
          }
        : conversation,
    ),
  });

  documentGenerationSubject.next({
    payload,
    conversationId,
  });
};

const addPromptAction = (conversationId: SUID, prompt: string): void => {
  const conversation = get().conversations.find(
    (conversation) => conversation.id === conversationId,
  );

  if (!conversation) {
    throw Error(`Conversation not found. Something went wrong`);
  }

  const payload = [...conversation.history]
    .reverse()
    .find((record) => record.type === `user`)?.payload;

  if (!payload) {
    throw Error(`Cannot find payload for conversation ${conversationId}`);
  }

  const newPayload = {
    ...payload,
    prompt,
  };

  set({
    conversations: get().conversations.map((conversation) =>
      conversation.id === conversationId
        ? {
            ...conversation,
            history: [
              ...conversation.history,
              {
                id: suid(),
                type: `user`,
                message: prompt,
                payload: newPayload,
              },
            ],
            operation: { is: `busy` },
          }
        : conversation,
    ),
  });

  documentGenerationSubject.next({
    payload: newPayload,
    conversationId,
  });
};

export {
  startConversationAction,
  toggleConversationAction,
  addAssistantReplyAction,
  closeConversationAction,
  stopGenerationAction,
  addAssistantErrorAction,
  retryGenerationAction,
  modifyGenerationPayloadAction,
  addPromptAction,
};
