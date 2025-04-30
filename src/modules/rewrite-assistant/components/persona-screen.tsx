import React from 'react';
import { Button } from 'design-system/button';
import {
  BiArrowBack,
  BiCheck,
  BiError,
  BiRefresh,
  BiStop,
  BiX,
} from 'react-icons/bi';
import { Markdown } from 'components/markdown';
import { useRewriteAssistantContext } from '../providers/rewrite-assistant.provider';
import { falsy } from 'development-kit/guards';
import { REWRITE_ASSISTANT_TRANSLATIONS } from '../config/translations';

const PersonaScreen = () => {
  const conversationListRef = React.useRef<HTMLOListElement>(null);
  const footerRef = React.useRef<HTMLElement>(null);
  const assistantCtx = useRewriteAssistantContext();

  falsy(
    assistantCtx.state.activePersona !== `none`,
    `Persona is set as "none"`,
  );

  React.useLayoutEffect(() => {
    const conversationList = conversationListRef.current;
    const footer = footerRef.current;

    if (!conversationList || !footer) return;

    const observer = new ResizeObserver(() => {
      footer.scrollIntoView({ behavior: `smooth`, block: `end` });
    });

    observer.observe(conversationList);

    return () => {
      observer.disconnect();
    };
  }, []);

  const { operation } = assistantCtx.state;

  const askAssistantAgain = (): void => {
    if (assistantCtx.state.activePersona === `none`) {
      throw new Error(`No persona selected`);
    }

    assistantCtx.dispatch({
      type: `ASK_AGAIN`,
      payload: assistantCtx.state.activePersona,
    });
  };

  const applyAssistantRewrite = (): void => {
    if (!lastAssistantMessage) {
      return;
    }

    assistantCtx.dispatch({
      type: `APPLY`,
      payload: lastAssistantMessage.content,
    });
  };

  const lastAssistantMessage = React.useMemo(
    () =>
      [...assistantCtx.state.messages]
        .reverse()
        .find((message) => message.type === `assistant-output`),
    [assistantCtx.state.messages],
  );

  return (
    <div className="animate-fade-in border-t pt-4 px-4 absolute w-full bottom-0 left-0 right-0 dark:bg-black bg-white border-zinc-300 dark:border-zinc-800 max-h-[70%] overflow-y-auto">
      <header className="flex items-center justify-between mb-4">
        <h6 className="mr-8">
          {
            REWRITE_ASSISTANT_TRANSLATIONS[assistantCtx.state.activePersona]
              .title
          }
        </h6>
        <div className="flex items-center space-x-2">
          <Button
            i={2}
            s={1}
            title="Close rewrite assistant"
            className="ml-auto"
            onClick={() => assistantCtx.dispatch({ type: `CLOSE` })}
          >
            <BiX />
          </Button>
        </div>
      </header>

      <section>
        <ol ref={conversationListRef} className="flex flex-col gap-3">
          {assistantCtx.state.messages.map((message) => {
            switch (message.type) {
              case `assistant-output`:
                return (
                  <li
                    className="rounded-md p-2 bg-zinc-200 border dark:bg-gray-950 border-zinc-300 dark:border-zinc-800"
                    key={message.id}
                  >
                    <Markdown>{message.content}</Markdown>
                  </li>
                );

              case `user-input`:
                return (
                  <li
                    className="w-fit rounded-md p-2 bg-zinc-200 border dark:bg-gray-950 border-zinc-300 dark:border-zinc-800"
                    key={message.id}
                  >
                    <p>
                      <strong>You: </strong>
                      {message.content}
                    </p>
                  </li>
                );

              case `system-error`:
                return (
                  <li
                    className="w-fit flex items-center gap-1.5 rounded-md p-2 bg-zinc-200 border dark:bg-gray-950 border-zinc-300 dark:border-zinc-800"
                    key={message.id}
                  >
                    <BiError size={20} className="shrink-0" />
                    <p>
                      <strong>System Error:{` `}</strong>
                      {message.content}
                    </p>
                  </li>
                );

              case `system-info`:
                return (
                  <li
                    className="w-fit rounded-md p-2 bg-zinc-200 border dark:bg-gray-950 border-zinc-300 dark:border-zinc-800"
                    key={message.id}
                  >
                    <p>
                      <strong>System: </strong>
                      {message.content}
                    </p>
                  </li>
                );
              default:
                return null;
            }
          })}
          {assistantCtx.state.operation.is === `busy` && (
            <li
              key="pending"
              className="w-fit rounded-md p-2 bg-zinc-200 border dark:bg-gray-950 border-zinc-300 dark:border-zinc-800 bg-gradient-to-r from-sky-200 via-pink-200 to-gray-300 dark:from-sky-800 dark:via-pink-800 dark:to-gray-900 animate-gradient-move bg-[length:200%_200%]"
            >
              Pending...
            </li>
          )}
        </ol>
        <footer
          ref={footerRef}
          className="pb-4 mt-8 flex items-center justify-end gap-2"
        >
          <Button
            s={1}
            i={2}
            title="Pick other assistant"
            onClick={() => assistantCtx.dispatch({ type: `RESET` })}
          >
            <BiArrowBack />
          </Button>
          {assistantCtx.state.operation.is === `fail` && (
            <Button
              s={1}
              i={2}
              onClick={askAssistantAgain}
              title="Generate new version"
            >
              <BiRefresh />
            </Button>
          )}
          {operation.is === `busy` ? (
            <Button
              s={1}
              i={2}
              title="Stop assistant"
              onClick={() => assistantCtx.dispatch({ type: `STOP` })}
            >
              <BiStop />
            </Button>
          ) : (
            <Button
              disabled={!lastAssistantMessage}
              s={1}
              i={2}
              title="Apply changes"
              onClick={applyAssistantRewrite}
            >
              <BiCheck />
            </Button>
          )}
        </footer>
      </section>
    </div>
  );
};

export { PersonaScreen };
