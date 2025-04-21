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
  BiEdit,
  BiError,
  BiListCheck,
  BiPencil,
  BiRefresh,
  BiSave,
  BiShow,
  BiStop,
  BiX,
} from 'react-icons/bi';
import {
  addAssistantErrorAction,
  addAssistantReplyAction,
  closeConversationAction,
  modifyGenerationPayloadAction,
  retryGenerationAction,
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
import { useSimpleFeature } from '@greenonsoftware/react-kit';
import { Modal } from 'design-system/modal';
import {
  NewDocumentForm,
  type NewDocumentFormProps,
} from 'components/new-document-form';
import Backdrop from 'design-system/backdrop';
import { Textarea } from 'design-system/textarea';

const ConversationListItemContainer = ({
  conversation,
}: {
  conversation: DocumentGenerationState['conversations'][number];
}) => {
  const conversationListRef = React.useRef<HTMLOListElement>(null);

  const promptField = useSimpleFeature();

  const closeOperation = useConfirm(() =>
    closeConversationAction(conversation.id),
  );
  const docManagementStore = useDocManagementStore();
  const editForm = useSimpleFeature();

  const confirmModifyGenerationModify: NewDocumentFormProps['onSubmit'] = (
    payload,
  ) => {
    if (payload.variant !== `ai`) {
      throw Error(`Invalid variant submission detected`);
    }

    modifyGenerationPayloadAction(conversation.id, {
      ...payload.values,
      style: payload.values.style.split(`,`),
    });
    editForm.off();
  };

  React.useLayoutEffect(() => {
    if (!conversation.opened) return;

    const conversationList = conversationListRef.current;
    const lastItem = conversationList?.lastElementChild;

    if (!conversationList || !lastItem) return;

    const observer = new ResizeObserver(() => {
      lastItem.scrollIntoView({ behavior: `smooth`, block: `end` });
    });

    observer.observe(conversationList);

    return () => {
      observer.disconnect();
    };
  }, [conversation.opened, conversation.history, conversation.operation]);

  return (
    <>
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
            <ol
              ref={conversationListRef}
              className={c(
                `flex flex-col px-3 gap-2 border-zinc-300 dark:border-zinc-800 border-t overflow-y-auto [&>*:first-child]:pt-3 [&>*:last-child]:pb-3`,
                promptField.isOn ? `max-h-[160px]` : `max-h-[300px]`,
              )}
            >
              {conversation.history.map((record) => {
                switch (record.type) {
                  case `user-started`:
                    return (
                      <div key={record.id}>
                        <li className="rounded-md w-fit py-1 px-2 bg-zinc-200 border dark:bg-gray-950 border-zinc-300 dark:border-zinc-800">
                          <p>{record.message}</p>
                        </li>
                      </div>
                    );
                  case `assistant-reply`:
                    return (
                      <div key={record.id}>
                        <li className="rounded-md w-fit flex flex-col gap-2 py-1 px-2 bg-zinc-200 border dark:bg-gray-950 border-zinc-300 dark:border-zinc-800">
                          <Markdown>{record.body.output}</Markdown>
                        </li>
                      </div>
                    );
                  case `system-message`:
                    return (
                      <div key={record.id}>
                        <li className="w-fit rounded-md py-1 px-2 bg-zinc-200 border dark:bg-gray-950 border-zinc-300 dark:border-zinc-800">
                          <p>
                            <strong>System: </strong>
                            {record.message}
                          </p>
                        </li>
                      </div>
                    );
                  default:
                    return null;
                }
              })}
              {conversation.operation.is === `busy` && (
                <div key="pending">
                  <li className="rounded-md py-1 px-2 w-fit bg-zinc-200 border dark:bg-gray-950 border-zinc-300 dark:border-zinc-800 bg-gradient-to-r from-sky-200 via-pink-200 to-gray-300 dark:from-sky-800 dark:via-pink-800 dark:to-gray-900 animate-gradient-move bg-[length:200%_200%]">
                    <Markdown>Pending...</Markdown>
                  </li>
                </div>
              )}
              {conversation.operation.is === `fail` && (
                <div key="error">
                  <li className="w-fit flex items-center gap-1.5 rounded-md py-1 px-2 bg-zinc-200 border dark:bg-gray-950 border-zinc-300 dark:border-zinc-800">
                    <BiError size={20} className="shrink-0" />
                    <p>
                      <strong>Error:{` `}</strong>
                      {conversation.operation.error.message}
                    </p>
                  </li>
                </div>
              )}
            </ol>
            {promptField.isOn && (
              <form className="py-2 px-3 flex flex-col items-end gap-2 justify-end border-zinc-300 dark:border-zinc-800 border-t">
                <Textarea
                  placeholder="What I can do for you :)?"
                  className="[&_textarea]:h-[100px] [&_textarea]:resize-none"
                />
                <footer className="flex gap-2">
                  <Button
                    i={1}
                    s={1}
                    auto
                    type="button"
                    title="Cancel prompt addition"
                    onClick={promptField.off}
                  >
                    Back
                  </Button>
                  <Button i={2} s={1} auto type="submit" title="Send prompt">
                    Send
                  </Button>
                </footer>
              </form>
            )}
            {promptField.isOff && (
              <div className="py-2 px-3 flex items-center gap-2 justify-end border-zinc-300 dark:border-zinc-800 border-t">
                {conversation.operation.is !== `busy` && (
                  <>
                    <Button
                      i={2}
                      s={1}
                      title="Customize prompt"
                      onClick={promptField.toggle}
                    >
                      <BiEdit />
                    </Button>
                    <Button
                      i={2}
                      s={1}
                      title="Modify generation parameters"
                      onClick={editForm.toggle}
                    >
                      <BiPencil />
                    </Button>
                  </>
                )}
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
                      onClick={() =>
                        saveGenerationAsDocumentAct(conversation.id)
                      }
                      title="Save as new document"
                    >
                      <BiSave />
                    </Button>
                  </>
                )}
                {(conversation.operation.is === `idle` ||
                  conversation.operation.is === `fail`) && (
                  <>
                    <Button
                      i={2}
                      s={1}
                      title="Retry generation"
                      onClick={() => retryGenerationAction(conversation.id)}
                    >
                      <BiRefresh />
                    </Button>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </li>
      {editForm.isOn && (
        <Modal onClose={editForm.off}>
          <Modal.Header
            title="Modify Generation Parameters"
            closeButtonTitle="Close modify generation parameters (esc)"
          />
          <NewDocumentForm
            variant="ai"
            onBack={editForm.off}
            onSubmit={confirmModifyGenerationModify}
            renderFooter={(props, { untouched, invalid }) => (
              <Button
                type="submit"
                i={2}
                s={2}
                className="mt-4"
                auto
                title="Save generation parameters"
                disabled={props.disabled || untouched || invalid}
              >
                Save
              </Button>
            )}
          />
        </Modal>
      )}
    </>
  );
};

const DocumentGenerationsContainer = () => {
  const { render } = usePortal();
  const { conversations } = useDocumentGenerationState();
  const mobileGenerationList = useSimpleFeature();

  React.useEffect(() => {
    const subscription = documentGenerationSubject
      .pipe(
        groupBy(({ conversationId }) => conversationId),
        mergeMap((grouped$) => {
          const conversationId = grouped$.key;

          return grouped$.pipe(
            switchMap(({ payload }) =>
              from(createContentWithAIAct(payload)).pipe(
                map((response) => ({ response, conversationId })),
                takeUntil(
                  documentGenerationCancelSubject.pipe(
                    filter((cancelId) => cancelId === conversationId),
                    take(1),
                  ),
                ),
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

  if (conversations.length === 0) {
    return null;
  }

  return render(
    <>
      <div className="md:block hidden fixed max-w-[360px] bottom-4 right-4">
        <ol className="flex flex-col gap-2">
          {conversations.map((conversation) => (
            <ConversationListItemContainer
              key={conversation.id}
              conversation={conversation}
            />
          ))}
        </ol>
      </div>
      <div className="flex items-end flex-col gap-2 md:hidden fixed right-4 top-4 max-w-[500px] w-[calc(100%-32px)]">
        <Button
          s={1}
          i={2}
          title="Show/hide generated documents"
          className="z-[11]"
          onClick={mobileGenerationList.toggle}
        >
          {mobileGenerationList.isOn ? <BiX /> : <BiListCheck />}
        </Button>

        {mobileGenerationList.isOn && (
          <>
            <Backdrop />
            <ol className="flex flex-col gap-2 w-full z-10">
              {conversations.map((conversation) => (
                <ConversationListItemContainer
                  key={conversation.id}
                  conversation={conversation}
                />
              ))}
            </ol>
          </>
        )}
      </div>
    </>,
  );
};

export { DocumentGenerationsContainer };
