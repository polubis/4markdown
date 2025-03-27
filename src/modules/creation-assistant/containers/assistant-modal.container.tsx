import { Modal } from 'design-system/modal';
import React from 'react';
import { meta } from '../../../../meta';
import { BiLogoBing, BiLogoGoogle } from 'react-icons/bi';
import { useCreationAssistantContext } from '../providers/creation-assistant.provider';

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
