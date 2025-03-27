import { Button } from 'design-system/button';
import React from 'react';
import { meta } from '../../../meta';
import { BiSolidMagicWand } from 'react-icons/bi';
import { useSimpleFeature } from '@greenonsoftware/react-kit';
import { AssistantModalContainer } from './containers/assistant-modal.container';

const CreationAssistantModule = () => {
  const assistantModal = useSimpleFeature();

  return (
    <>
      <Button
        className="absolute bottom-2 right-4 bg-gradient-to-r from-purple-400 via-emerald-400 to-indigo-400 dark:from-purple-600 dark:via-emerald-600 dark:to-indigo-600 animate-gradient-move bg-[length:300%_300%]"
        title={`Use ${meta.appName} assistant`}
        i={2}
        s={1}
        onClick={assistantModal.on}
      >
        <BiSolidMagicWand />
      </Button>
      {assistantModal.isOn && <AssistantModalContainer />}
    </>
  );
};

export { CreationAssistantModule };
