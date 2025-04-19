import { usePortal } from 'development-kit/use-portal';
import React from 'react';
import {
  documentGenerationCancelSubject,
  documentGenerationSubject,
  useDocumentGenerationState,
} from 'store/document-generation';
import c from 'classnames';
import { Button } from 'design-system/button';
import {
  BiCheck,
  BiChevronDown,
  BiError,
  BiSave,
  BiShow,
  BiStop,
  BiX,
} from 'react-icons/bi';
import {
  addAssistantErrorAction,
  addAssistantReplyAction,
  closeConversationAction,
  stopGenerationAction,
  toggleConversationAction,
} from 'store/document-generation/actions';
import { Markdown } from 'components/markdown';
import type { DocumentGenerationState } from 'store/document-generation/models';
import {
  filter,
  from,
  groupBy,
  map,
  mergeMap,
  switchMap,
  take,
  takeUntil,
} from 'rxjs';
import { createContentWithAIAct } from 'acts/create-content-with-ai.act';
import { useConfirm } from 'development-kit/use-confirm';
import { previewGenerationInDocumentsCreatorAct } from 'acts/preview-generation-in-documents-creator.act';
import { useDocManagementStore } from 'store/doc-management/doc-management.store';
import { saveGenerationAsDocumentAct } from 'acts/save-generation-as-document.act';

const ConversationListItemContainer = ({
  conversation,
}: {
  conversation: DocumentGenerationState['conversations'][number];
}) => {
  const closeOperation = useConfirm(() =>
    closeConversationAction(conversation.id),
  );
  const docManagementStore = useDocManagementStore();

  return (
    <li
      key={conversation.id}
      className={c(
        `rounded-md dark:bg-black bg-white border border-zinc-300 dark:border-zinc-800 overflow-hidden`,
        !conversation.opened &&
          conversation.operation.is === `busy` &&
          `bg-gradient-to-r from-sky-200 via-pink-200 to-gray-300 dark:from-sky-800 dark:via-pink-800 dark:to-gray-900 animate-gradient-move bg-[length:200%_200%]`,
      )}
    >
      <div className="relative flex items-center py-2 gap-1 px-3">
        <h6 className="truncate mr-1">{conversation.payload.name}</h6>
        <Button
          i={1}
          s={1}
          title="Open/close conversation"
          className="ml-auto"
          disabled={closeOperation.isOn}
          onClick={() => toggleConversationAction(conversation.id)}
        >
          <BiChevronDown
            className={c(
              `transition-transform`,
              conversation.opened && `rotate-180`,
            )}
            size={24}
          />
        </Button>
        <Button
          i={1}
          s={1}
          disabled={closeOperation.isOn}
          title="Close conversation"
          onClick={closeOperation.confirm}
        >
          <BiX />
        </Button>
        {closeOperation.isOn && (
          <div className="flex py-2 px-3 gap-1 items-center animate-fade-in absolute top-0 left-0 w-full h-full dark:bg-black bg-white">
            <h6 className="mr-1 truncate">Are you sure?</h6>
            <Button
              i={1}
              className="ml-auto"
              s={1}
              title="Confirm conversation close"
              onClick={closeOperation.confirm}
            >
              <BiCheck />
            </Button>
            <Button
              i={1}
              s={1}
              title="Cancel conversation close"
              onClick={closeOperation.off}
            >
              <BiX />
            </Button>
          </div>
        )}
      </div>
      {conversation.opened && (
        <>
          <ol className="py-4 px-3 flex flex-col gap-2 border-zinc-300 dark:border-zinc-800 border-t max-h-[300px] overflow-y-auto">
            {conversation.history.map((record) => {
              switch (record.type) {
                case `user-started`:
                  return (
                    <li
                      className="rounded-md w-fit py-1 px-2 bg-zinc-200 border dark:bg-gray-950 border-zinc-300 dark:border-zinc-800"
                      key={record.id}
                    >
                      <p>{record.message}</p>
                    </li>
                  );
                case `assistant-reply`:
                  return (
                    <li
                      className="rounded-md w-fit flex flex-col gap-2 py-1 px-2 bg-zinc-200 border dark:bg-gray-950 border-zinc-300 dark:border-zinc-800"
                      key={record.id}
                    >
                      <Markdown>{record.body.output}</Markdown>
                    </li>
                  );
                case `system-message`:
                  return (
                    <li
                      className="w-fit rounded-md py-1 px-2 bg-zinc-200 border dark:bg-gray-950 border-zinc-300 dark:border-zinc-800"
                      key={record.id}
                    >
                      <p>
                        <strong>System: </strong>
                        {record.message}
                      </p>
                    </li>
                  );
                default:
                  return null;
              }
            })}
            {conversation.operation.is === `busy` && (
              <li
                className="rounded-md py-1 px-2 w-fit bg-zinc-200 border dark:bg-gray-950 border-zinc-300 dark:border-zinc-800 bg-gradient-to-r from-sky-200 via-pink-200 to-gray-300 dark:from-sky-800 dark:via-pink-800 dark:to-gray-900 animate-gradient-move bg-[length:200%_200%]"
                key="pending"
              >
                <Markdown>Pending...</Markdown>
              </li>
            )}
            {conversation.operation.is === `fail` && (
              <li
                className="w-fit flex items-center gap-1.5 rounded-md py-1 px-2 bg-zinc-200 border dark:bg-gray-950 border-zinc-300 dark:border-zinc-800"
                key="error"
              >
                <BiError size={20} className="shrink-0" />
                <p>
                  <strong>Error:{` `}</strong>
                  {conversation.operation.error.message}
                </p>
              </li>
            )}
          </ol>
          <div className="py-2 px-3 flex items-center gap-2 justify-end border-zinc-300 dark:border-zinc-800 border-t">
            {conversation.operation.is === `busy` && (
              <Button
                i={2}
                s={1}
                title="Stop generation"
                onClick={() => stopGenerationAction(conversation.id)}
              >
                <BiStop />
              </Button>
            )}
            {conversation.operation.is === `ok` && (
              <>
                <Button
                  i={2}
                  s={1}
                  title="Display generated content in creator"
                  disabled={docManagementStore.is === `busy`}
                  onClick={() =>
                    previewGenerationInDocumentsCreatorAct(conversation.id)
                  }
                >
                  <BiShow />
                </Button>
                <Button
                  disabled={docManagementStore.is === `busy`}
                  i={2}
                  s={1}
                  onClick={() => saveGenerationAsDocumentAct(conversation.id)}
                  title="Save as new document"
                >
                  <BiSave />
                </Button>
              </>
            )}
          </div>
        </>
      )}
    </li>
  );
};

const DocumentGenerationsContainer = () => {
  const { render } = usePortal();
  const { conversations } = useDocumentGenerationState();

  React.useEffect(() => {
    const subscription = documentGenerationSubject
      .pipe(
        groupBy(({ conversationId }) => conversationId),
        mergeMap((grouped$) => {
          const conversationId = grouped$.key;

          const cancelNotifier$ = documentGenerationCancelSubject
            .asObservable()
            .pipe(
              filter((cancelId) => cancelId === conversationId),
              take(1),
            );

          return grouped$.pipe(
            switchMap(({ payload }) =>
              from(createContentWithAIAct(payload)).pipe(
                takeUntil(cancelNotifier$),
                map((response) => ({ response, conversationId })),
              ),
            ),
          );
        }),
      )
      .subscribe({
        next: ({ response, conversationId }) => {
          response.is === `ok`
            ? addAssistantReplyAction(conversationId, response.data)
            : addAssistantErrorAction(conversationId, response.error);
        },
      });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return render(
    <div className="fixed md:max-w-[360px] w-[calc(100%-16px)] md:w-full right-2 top-2 md:bottom-2 md:top-auto">
      <ol className="flex flex-col gap-2">
        {conversations.map((conversation) => (
          <ConversationListItemContainer
            key={conversation.id}
            conversation={conversation}
          />
        ))}
      </ol>
    </div>,
  );
};

export { DocumentGenerationsContainer };
