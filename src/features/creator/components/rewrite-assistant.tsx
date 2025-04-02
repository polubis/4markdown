import React, { type FormEvent } from 'react';
import { Button } from 'design-system/button';
import { BiArrowBack, BiCheck, BiRefresh, BiStop, BiX } from 'react-icons/bi';
import { type SUID, suid } from 'development-kit/suid';
import { Markdown } from 'components/markdown';
import type { ParsedError } from 'api-4markdown-contracts';
import { parseError } from 'api-4markdown';
import { context } from '@greenonsoftware/react-kit';

type RewriteAssistantProps = {
  content: string;
  onClose: () => void;
};

const PERSONAS = [`jelly`, `kate`, `josh`] as const;

type Persona = (typeof PERSONAS)[number];

type ConversationMessage = {
  id: SUID;
  type: `user-input` | `assistant-output` | `system-info`;
  content: string;
};

type Status =
  | { is: `idle` }
  | { is: `busy` }
  | { is: `ok` }
  | { is: `stopped` }
  | { is: `fail`; error: ParsedError };

const PERSONA_DESCRIPTIONS = {
  jelly: `casual, straight to the point`,
  kate: `technical, detailed, rich`,
  josh: `edgy, sarcastic, funny`,
} satisfies Record<Persona, string>;

const [RewriteAssistantProvider, useRewriteAssistantContext] = context(
  ({ content, onClose }: RewriteAssistantProps) => {
    const [status, setStatus] = React.useState<Status>({ is: `idle` });

    const [activePersona, setActivePersona] = React.useState<Persona | `none`>(
      `none`,
    );

    const [conversation, setConversation] = React.useState<
      ConversationMessage[]
    >(() => [
      {
        id: suid(),
        type: `user-input`,
        content: `Please rewrite me selected fragment. Be ${PERSONA_DESCRIPTIONS.jelly}`,
      },
      {
        id: suid(),
        type: `system-info`,
        content: `Here is an improved version of the fragment`,
      },
      {
        id: suid(),
        type: `assistant-output`,
        content,
      },
    ]);

    return {
      activePersona,
      conversation,
      setConversation,
      content,
      status,
      setStatus,
      onClose,
      setActivePersona,
    };
  },
);

const RewriteAssistant = () => {
  const {
    activePersona,
    setActivePersona,
    setConversation,
    setStatus,
    content,
    status,
    onClose,
    conversation,
  } = useRewriteAssistantContext();

  const askAssistant = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    try {
      if (status.is === `busy`) {
        return;
      }

      setStatus({ is: `busy` });

      const responseContent = await new Promise<string>((resolve, reject) => {
        setTimeout(async () => {
          try {
            const response = await fetch(`/intro.md`);
            const content = await response.text();
            return resolve(content);
          } catch (error: unknown) {
            return reject(error);
          }
        }, 1000);
      });

      setStatus({ is: `ok` });
      setConversation((prevConversation) => [
        ...prevConversation,
        {
          id: suid(),
          type: `assistant-output`,
          content: responseContent,
        },
      ]);
    } catch (error) {
      setStatus({ is: `fail`, error: parseError(error) });
    }
  };

  if (activePersona === `none`) {
    return (
      <div className="animate-fade-in border-t p-4 absolute w-full bottom-0 left-0 right-0 dark:bg-black bg-white border-zinc-300 dark:border-zinc-800 max-h-[70%] overflow-y-auto">
        <header className="flex items-center justify-between mb-4">
          <h6 className="mr-8">Pick Persona and Rewrite</h6>
          <div className="flex items-center space-x-2">
            <Button
              i={2}
              s={1}
              title="Close rewrite assistant"
              className="ml-auto"
              onClick={onClose}
            >
              <BiX />
            </Button>
          </div>
        </header>

        <section>
          <h6 className="mb-2 font-semibold text-sm">Selected Content</h6>
          <div className="rounded-md mb-4 p-2 bg-zinc-200 border dark:bg-gray-950 border-zinc-300 dark:border-zinc-800">
            <p className="text-sm">{content}</p>
          </div>
        </section>

        <section>
          <h6 className="block mb-2 font-semibold text-sm">
            Available Personas
          </h6>
          <div className="flex flex-wrap gap-2">
            {PERSONAS.map((persona) => (
              <Button
                i={2}
                s={2}
                auto
                key={persona}
                title={`Improve fragment with ${persona}`}
                onClick={() => setActivePersona(persona)}
                className="text-sm"
              >
                <strong className="capitalize">{persona}:</strong>
                {` `}
                {PERSONA_DESCRIPTIONS[persona]}
              </Button>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <form
      className="animate-fade-in border-t p-4 absolute w-full bottom-0 left-0 right-0 dark:bg-black bg-white border-zinc-300 dark:border-zinc-800 max-h-[70%] overflow-y-auto"
      onSubmit={askAssistant}
    >
      <header className="flex items-center justify-between mb-4">
        <h6 className="mr-8">
          You&apos;re Talking with{` `}
          <strong className="capitalize">{activePersona}</strong>
        </h6>
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            i={2}
            s={1}
            title="Close rewrite assistant"
            className="ml-auto"
            onClick={onClose}
          >
            <BiX />
          </Button>
        </div>
      </header>

      <section>
        <ol className="flex flex-col gap-3">
          {conversation.map((entry) => {
            switch (entry.type) {
              case `assistant-output`:
                return (
                  <li
                    className="rounded-md p-2 bg-zinc-200 border dark:bg-gray-950 border-zinc-300 dark:border-zinc-800"
                    key={entry.id}
                  >
                    <Markdown>{entry.content}</Markdown>
                  </li>
                );

              case `user-input`:
                return (
                  <li
                    className="w-fit rounded-md p-2 bg-zinc-200 border dark:bg-gray-950 border-zinc-300 dark:border-zinc-800"
                    key={entry.id}
                  >
                    <p>
                      <strong>You: </strong>
                      {entry.content}
                    </p>
                  </li>
                );

              case `system-info`:
                return (
                  <li
                    className="w-fit rounded-md p-2 bg-zinc-200 border dark:bg-gray-950 border-zinc-300 dark:border-zinc-800"
                    key={entry.id}
                  >
                    <p>
                      <strong>System: </strong>
                      {entry.content}
                    </p>
                  </li>
                );
              default:
                return null;
            }
          })}
          {status.is === `busy` && (
            <li
              key="pending"
              className="w-fit rounded-md p-2 bg-zinc-200 border dark:bg-gray-950 border-zinc-300 dark:border-zinc-800 bg-gradient-to-r from-sky-200 via-pink-200 to-gray-300 dark:from-sky-800 dark:via-pink-800 dark:to-gray-900 animate-gradient-move bg-[length:200%_200%]"
            >
              Pending...
            </li>
          )}
        </ol>
        <footer className="mt-8 flex items-center justify-end gap-2">
          <Button
            type="button"
            s={1}
            i={2}
            title="Pick other assistant"
            onClick={() => setActivePersona(`none`)}
          >
            <BiArrowBack />
          </Button>
          <Button
            className="ml-auto"
            type="button"
            disabled={status.is === `busy`}
            s={1}
            i={2}
            title="Try other version"
          >
            <BiRefresh />
          </Button>
          {status.is === `busy` ? (
            <Button
              type="button"
              s={1}
              i={2}
              title="Stop assistant"
              onClick={() => setStatus({ is: `stopped` })}
            >
              <BiStop />
            </Button>
          ) : (
            <Button type="submit" s={1} i={2} title="Apply changes">
              <BiCheck />
            </Button>
          )}
        </footer>
      </section>
    </form>
  );
};

const ConnectedRewriteAssistant = (props: RewriteAssistantProps) => {
  return (
    <RewriteAssistantProvider {...props}>
      <RewriteAssistant />
    </RewriteAssistantProvider>
  );
};

export { ConnectedRewriteAssistant as RewriteAssistant };
