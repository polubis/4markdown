import React from 'react';
import { Button } from 'design-system/button';
import { BiX } from 'react-icons/bi';
import { type SUID, suid } from 'development-kit/suid';

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

  const [conversation, setConversation] = React.useState<ConversationMessage[]>(
    () => [
      {
        id: suid(),
        type: `user`,
        content: `Please, rewrite me selected fragment`,
      },
    ],
  );

  if (activePersona === `none`) {
    return (
      <div className="animate-fade-in border-t p-4 absolute w-full bottom-0 left-0 right-0 dark:bg-black bg-white border-zinc-300 dark:border-zinc-800">
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
    <div className="animate-fade-in border-t p-4 absolute w-full bottom-0 left-0 right-0 dark:bg-black bg-white border-zinc-300 dark:border-zinc-800">
      <header className="flex items-center justify-between mb-3">
        <h6 className="font-bold mr-8">
          You&apos;re Talking with{` `}
          <span className="capitalize">{activePersona}</span>
        </h6>
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
        <ol className="flex flex-col">
          {conversation.map((entry) => (
            <li
              className="w-fit rounded-md mb-4 p-2 bg-zinc-200 border dark:bg-gray-950 border-zinc-300 dark:border-zinc-800"
              key={entry.id}
            >
              <p>{entry.content}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
};

export { RewriteAssistant };
