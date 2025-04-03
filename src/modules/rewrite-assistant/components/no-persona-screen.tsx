import { REWRITE_ASSISTANT_PERSONAS } from 'api-4markdown-contracts';
import { Button } from 'design-system/button';
import React from 'react';
import { BiX } from 'react-icons/bi';
import { useRewriteAssistantContext } from '../providers/rewrite-assistant.provider';
import { REWRITE_ASSISTANT_PERSONA_DESCRIPTIONS } from '../models';

const NoPersonaScreen = () => {
  const assistantCtx = useRewriteAssistantContext();

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
            onClick={() => assistantCtx.dispatch({ type: `CLOSE` })}
          >
            <BiX />
          </Button>
        </div>
      </header>

      <section>
        <h6 className="mb-2 font-semibold text-sm">Selected Content</h6>
        <div className="rounded-md mb-4 p-2 bg-zinc-200 border dark:bg-gray-950 border-zinc-300 dark:border-zinc-800">
          <p className="text-sm">{assistantCtx.content}</p>
        </div>
      </section>

      <section>
        <h6 className="block mb-2 font-semibold text-sm">Available Personas</h6>
        <div className="flex flex-wrap gap-2">
          {REWRITE_ASSISTANT_PERSONAS.map((persona) => (
            <Button
              i={2}
              s={2}
              auto
              key={persona}
              title={`Improve fragment with ${persona}`}
              onClick={() =>
                assistantCtx.dispatch({
                  type: `SELECT_PERSONA`,
                  payload: persona,
                })
              }
              className="text-sm"
            >
              <strong className="capitalize">{persona}:</strong>
              {` `}
              {REWRITE_ASSISTANT_PERSONA_DESCRIPTIONS[persona]}
            </Button>
          ))}
        </div>
      </section>
    </div>
  );
};

export { NoPersonaScreen };
