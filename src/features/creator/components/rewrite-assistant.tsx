import React from 'react';
import { Button } from 'design-system/button';
import { BiCheck, BiRefresh, BiX } from 'react-icons/bi';
import { type SUID, suid } from 'development-kit/suid';
import c from 'classnames';
import { Markdown } from 'components/markdown';

type RewriteAssistantProps = {
  content: string;
  onClose: () => void;
};

const PERSONAS = [`jelly`, `kate`, `josh`] as const;

type Persona = (typeof PERSONAS)[number];

type ConversationMessage = {
  id: SUID;
  type: `user` | `assistant` | `system`;
  content: string;
};

const PERSONA_DESCRIPTIONS = {
  jelly: `casual, straight to the point`,
  kate: `technical, detailed, rich`,
  josh: `edgy, sarcastic, funny`,
} satisfies Record<Persona, string>;

const RewriteAssistant = ({ content, onClose }: RewriteAssistantProps) => {
  const [activePersona, setActivePersona] = React.useState<Persona | `none`>(
    `none`,
  );

  const [conversation] = React.useState<ConversationMessage[]>(() => [
    {
      id: suid(),
      type: `user`,
      content: `Please, rewrite me selected fragment`,
    },
    {
      id: suid(),
      type: `system`,
      content: `Thinking...`,
    },
    {
      id: suid(),
      type: `assistant`,
      content,
    },
  ]);

  if (activePersona === `none`) {
    return (
      <div className="animate-fade-in border-t p-4 absolute w-full bottom-0 left-0 right-0 dark:bg-black bg-white border-zinc-300 dark:border-zinc-800 max-h-[70%] overflow-y-auto">
        <header className="flex items-center justify-between mb-3">
          <h6 className="font-bold mr-8">Pick Persona and Rewrite</h6>
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
    <form className="animate-fade-in border-t p-4 absolute w-full bottom-0 left-0 right-0 dark:bg-black bg-white border-zinc-300 dark:border-zinc-800 max-h-[70%] overflow-y-auto">
      <header className="flex items-center justify-between mb-3">
        <h6 className="font-bold mr-8">
          You&apos;re Talking with{` `}
          <span className="capitalize">{activePersona}</span>
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
        <ol className="flex flex-col gap-2">
          {conversation.map((entry) =>
            entry.type === `assistant` ? (
              <li
                className="rounded-md p-2 bg-zinc-200 border dark:bg-gray-950 border-zinc-300 dark:border-zinc-800"
                key={entry.id}
              >
                <Markdown>{entry.content}</Markdown>
              </li>
            ) : (
              <li
                className={c(
                  `w-fit rounded-md p-2 bg-zinc-200 border dark:bg-gray-950 border-zinc-300 dark:border-zinc-800`,
                  {
                    'bg-gradient-to-r from-sky-200 via-pink-200 to-gray-300 dark:from-sky-800 dark:via-pink-800 dark:to-gray-900 animate-gradient-move bg-[length:200%_200%]':
                      entry.type === `system`,
                  },
                )}
                key={entry.id}
              >
                <p>{entry.content}</p>
              </li>
            ),
          )}
        </ol>
        <footer className="ml-auto mt-4 flex items-center justify-end gap-2">
          <Button type="button" s={1} i={2} title="Try again">
            <BiRefresh />
          </Button>
          <Button type="submit" s={1} i={2} title="Apply changes">
            <BiCheck />
          </Button>
        </footer>
      </section>
    </form>
  );
};

export { RewriteAssistant };
