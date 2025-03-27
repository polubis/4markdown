import { Modal } from 'design-system/modal';
import React from 'react';
import { meta } from '../../../../meta';
import { BiLogoGoogle } from 'react-icons/bi';
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
      <h6 className="mb-2">Selected Content</h6>
      <section className="rounded-md mb-4 px-2 py-1 bg-zinc-200 border dark:bg-gray-950 border-zinc-300 dark:border-zinc-800">
        <p className="text-sm">{content}</p>
      </section>
      {activeMode === `none` && (
        <section className="flex flex-wrap gap-3">
          <a
            href={`https://www.google.com?q=${content}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Search in Google"
            className="cursor-pointer hover:bg-zinc-300 dark:hover:bg-gray-900 p-3 rounded-md bg-zinc-200 border dark:bg-gray-950 border-zinc-300 dark:border-zinc-800"
          >
            <BiLogoGoogle />
          </a>
        </section>
      )}
    </Modal>
  );
};

export { AssistantModalContainer };
