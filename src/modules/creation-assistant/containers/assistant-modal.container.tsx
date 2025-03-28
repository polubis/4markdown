import { Modal } from 'design-system/modal';
import React, { Fragment } from 'react';
import { BiLogoBing, BiLogoGoogle } from 'react-icons/bi';
import { useCreationAssistantContext } from '../providers/creation-assistant.provider';
import { meta } from '../../../../meta';
import type {
  API4MarkdownDto,
  API4MarkdownPayload,
  AssistantPersona,
} from 'api-4markdown-contracts';
import { ASSISTANT_PERSONAS } from 'api-4markdown-contracts';
import type { Transaction } from 'development-kit/utility-types';
import { rewriteWithAssistantAct } from 'acts/rewrite-with-assistant.act';
import { Button } from 'design-system/button';

type AssistantMode = `none` | `rewrite`;

const ASSISTANT_PERSONAS_DESCRIPTIONS = {
  jelly: `casual, straight to the point`,
  kate: `technical, detailed, rich`,
  josh: `edgy, sarcastic, funny`,
} satisfies Record<AssistantPersona, string>;

const AssistantModalContainer = () => {
  const [operation, setOperation] = React.useState<
    Transaction<{ data: API4MarkdownDto<`rewriteWithAssistant`> }>
  >({ is: `idle` });
  const [answers, setAnswers] = React.useState<
    Partial<Record<AssistantPersona, API4MarkdownDto<`rewriteWithAssistant`>[]>>
  >({});
  const { close, content } = useCreationAssistantContext();
  const [activeMode] = React.useState<AssistantMode>(`none`);

  const askForRewrite = async (
    persona: API4MarkdownPayload<`rewriteWithAssistant`>['persona'],
  ): Promise<void> => {
    setOperation({ is: `busy` });

    const result = await rewriteWithAssistantAct({
      input: content,
      persona,
    });

    if (result.is === `ok`) {
      setAnswers((prev) => ({
        ...prev,
        [persona]: [...(prev[persona] ?? []), result.data],
      }));
    }

    setOperation(result);
  };

  const busy = operation.is === `busy`;

  console.log(answers);

  return (
    <Modal disabled={busy} onClose={close}>
      <Modal.Header
        title={`${meta.appName} Writing Assistant`}
        closeButtonTitle="Close writing assistant"
      />

      <section>
        <h6 className="mb-2">Selected Content</h6>
        <div className="rounded-md mb-4 p-3 bg-zinc-200 border dark:bg-gray-950 border-zinc-300 dark:border-zinc-800 overflow-hidden">
          <p className="text-sm">{content}</p>
        </div>
      </section>

      {activeMode === `none` && (
        <>
          <section className="mb-3">
            <h6 className="block mb-2 font-semibold text-sm">
              Improve With AI Persona
            </h6>
            <div className="flex flex-col gap-2">
              {ASSISTANT_PERSONAS.map((persona) => (
                <Fragment key={persona}>
                  <Button
                    i={2}
                    s={2}
                    auto
                    disabled={busy}
                    title={`Improve fragment with ${persona}`}
                    onClick={() => askForRewrite(persona)}
                    className="text-sm !justify-start"
                  >
                    <strong className="capitalize">{persona}:</strong>
                    {` `}
                    {ASSISTANT_PERSONAS_DESCRIPTIONS[persona]}
                  </Button>
                  {Array.isArray(answers[persona]) &&
                    answers[persona].map((answer, index) => (
                      <div key={`${persona}-${index}`}>
                        <h6 className="mb-2">Answer {index + 1}</h6>
                        <div className="rounded-md mb-4 p-3 bg-zinc-200 border dark:bg-gray-950 border-zinc-300 dark:border-zinc-800 overflow-hidden">
                          <p className="text-sm">{answer.output}</p>
                        </div>
                      </div>
                    ))}
                </Fragment>
              ))}
            </div>
          </section>
          <section>
            <h6 className="block mb-2 font-semibold text-sm">Search In Web</h6>
            <div className="flex flex-wrap gap-2">
              <a
                href={`https://www.google.com?q=${content}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Search in Google"
                className="cursor-pointer hover:bg-zinc-300 dark:hover:bg-gray-900 p-3 rounded-md bg-zinc-200 border dark:bg-gray-950 border-zinc-300 dark:border-zinc-800"
              >
                <BiLogoGoogle />
              </a>
              <a
                href={`https://www.bing.com/search?q=${content}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Search in Microsoft Bing"
                className="cursor-pointer hover:bg-zinc-300 dark:hover:bg-gray-900 p-3 rounded-md bg-zinc-200 border dark:bg-gray-950 border-zinc-300 dark:border-zinc-800"
              >
                <BiLogoBing />
              </a>
            </div>
          </section>
        </>
      )}
    </Modal>
  );
};

export { AssistantModalContainer };
