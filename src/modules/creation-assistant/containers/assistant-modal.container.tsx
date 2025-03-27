import { Modal } from 'design-system/modal';
import React from 'react';
import { BiLogoBing, BiLogoGoogle } from 'react-icons/bi';
import { useCreationAssistantContext } from '../providers/creation-assistant.provider';
import { meta } from '../../../../meta';

type AssistantMode = `none` | `rewrite`;

const AssistantModalContainer = () => {
  const { close, content } = useCreationAssistantContext();
  const [activeMode] = React.useState<AssistantMode>(`none`);

  return (
    <Modal onClose={close}>
      <Modal.Header
        title={`${meta.appName} Writing Assistant`}
        closeButtonTitle="Close writing assistant"
      />

      <section>
        <h6 className="mb-2">Selected Content</h6>
        <div className="rounded-md mb-4 p-3 bg-zinc-200 border dark:bg-gray-950 border-zinc-300 dark:border-zinc-800">
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
              <button
                title="Improve fragment with Jelly"
                className="text-left cursor-pointer hover:bg-zinc-300 dark:hover:bg-gray-900 p-3 rounded-md bg-zinc-200 border dark:bg-gray-950 border-zinc-300 dark:border-zinc-800"
              >
                <strong>Jelly:</strong> casual, straight to the point
              </button>
              <button
                title="Improve fragment with Kate"
                className="text-left cursor-pointer hover:bg-zinc-300 dark:hover:bg-gray-900 p-3 rounded-md bg-zinc-200 border dark:bg-gray-950 border-zinc-300 dark:border-zinc-800"
              >
                <strong>Kate:</strong> technical, detailed, rich
              </button>
              <button
                title="Improve fragment with Josh"
                className="text-left cursor-pointer hover:bg-zinc-300 dark:hover:bg-gray-900 p-3 rounded-md bg-zinc-200 border dark:bg-gray-950 border-zinc-300 dark:border-zinc-800"
              >
                <strong>Josh:</strong> edgy, sarcastic, funny
              </button>
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
