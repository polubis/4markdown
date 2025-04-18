import { usePortal } from 'development-kit/use-portal';
import React from 'react';
import {
  documentGenerationCancelSubject,
  documentGenerationSubject,
  useDocumentGenerationState,
} from 'store/document-generation';
import c from 'classnames';
import { Button } from 'design-system/button';
import { BiChevronDown } from 'react-icons/bi';
import { toggleConversationAction } from 'store/document-generation/actions';
import { Markdown } from 'components/markdown';
import type { DocumentGenerationState } from 'store/document-generation/models';
import {
  filter,
  from,
  groupBy,
  mergeMap,
  switchMap,
  take,
  takeUntil,
} from 'rxjs';
import { createContentWithAIAct } from 'acts/create-content-with-ai.act';

const ConversationListItemContainer = ({
  conversation,
}: {
  conversation: DocumentGenerationState['conversations'][number];
}) => {
  return (
    <li
      key={conversation.id}
      className={c(
        `rounded-md py-2 px-3 dark:bg-black bg-white border border-zinc-300 dark:border-zinc-800`,
        !conversation.opened &&
          conversation.operation.is === `busy` &&
          `bg-gradient-to-r from-sky-200 via-pink-200 to-gray-300 dark:from-sky-800 dark:via-pink-800 dark:to-gray-900 animate-gradient-move bg-[length:200%_200%]`,
      )}
    >
      <div className="flex items-center gap-3 justify-between">
        <h6 className="truncate w-full text-lg">{conversation.payload.name}</h6>
        <Button
          i={1}
          s={1}
          title="Open/close conversation"
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
      </div>
      {conversation.opened && (
        <ol className="flex flex-col gap-2 mt-3">
          {conversation.history.map((record) => {
            switch (record.type) {
              case `user-started`:
                return (
                  <li
                    className="rounded-md w-fit py-1 px-2 bg-zinc-200 border dark:bg-gray-950 border-zinc-300 dark:border-zinc-800"
                    key={record.id}
                  >
                    <Markdown>{record.message}</Markdown>
                  </li>
                );
              default:
                return null;
            }
          })}
          <li
            className="rounded-md py-1 px-2 w-fit bg-zinc-200 border dark:bg-gray-950 border-zinc-300 dark:border-zinc-800 bg-gradient-to-r from-sky-200 via-pink-200 to-gray-300 dark:from-sky-800 dark:via-pink-800 dark:to-gray-900 animate-gradient-move bg-[length:200%_200%]"
            key="pending"
          >
            <Markdown>Pending...</Markdown>
          </li>
        </ol>
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

          const cancelNotifier$ = documentGenerationCancelSubject.pipe(
            filter((cancelId) => cancelId === conversationId),
            take(1),
          );

          return grouped$.pipe(
            switchMap(({ payload }) =>
              from(createContentWithAIAct(payload)).pipe(
                takeUntil(cancelNotifier$),
              ),
            ),
          );
        }),
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return render(
    <div className="fixed bottom-4 md:max-w-md w-full right-4">
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
