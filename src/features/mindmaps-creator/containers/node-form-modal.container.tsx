import { Button } from 'design-system/button';
import Modal from 'design-system/modal';
import { Tabs } from 'design-system/tabs';
import React from 'react';
import { BiX } from 'react-icons/bi';
import { InternalNodeFormContainer } from './internal-node-form.container';
import type { MindmapNodeType } from 'api-4markdown-contracts';
import {
  mindmapsCreatorStoreActions,
  mindmapsCreatorStoreSelectors,
} from 'store/mindmaps-creator/mindmaps-creator.store';

const NodeFormModalContainer = () => {
  const nodeToEdit = mindmapsCreatorStoreSelectors.useInternalNodeToEdit();
  const [type, setType] = React.useState<MindmapNodeType>(`internal`);

  return (
    <Modal onEscape={mindmapsCreatorStoreActions.cancelAddingNode}>
      <div className="flex items-center justify-between gap-4 mb-6">
        <h6 className="text-xl">{nodeToEdit ? `Node Edition` : `Add Node`}</h6>
        <Button
          type="button"
          i={2}
          s={1}
          title="Close mindmap node adding"
          onClick={mindmapsCreatorStoreActions.cancelAddingNode}
        >
          <BiX />
        </Button>
      </div>
      {nodeToEdit ? null : (
        <Tabs className="mb-5">
          <Tabs.Item
            active={type === `internal`}
            onClick={() => setType(`internal`)}
          >
            Internal
          </Tabs.Item>
        </Tabs>
      )}

      {type === `internal` && <InternalNodeFormContainer />}
    </Modal>
  );
};

export { NodeFormModalContainer };
