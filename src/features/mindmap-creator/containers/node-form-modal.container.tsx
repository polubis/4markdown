import { Button } from 'design-system/button';
import Modal from 'design-system/modal';
import { Tabs } from 'design-system/tabs';
import React from 'react';
import { BiX } from 'react-icons/bi';
import { InternalNodeFormContainer } from './internal-node-form.container';
import type { MindmapNodeType } from 'api-4markdown-contracts';
import {
  mindmapCreatorStoreActions,
  mindmapCreatorStoreSelectors,
} from 'store/mindmap-creator/mindmap-creator.store';
import { ExternalNodeFormContainer } from './external-node-form.container';

const NodeFormModalContainer = () => {
  const nodeToEdit = mindmapCreatorStoreSelectors.useNodeToEdit();
  const [type, setType] = React.useState<MindmapNodeType>(
    nodeToEdit?.type ?? `internal`,
  );

  return (
    <Modal onEscape={mindmapCreatorStoreActions.cancelAddingNode}>
      <div className="flex items-center justify-between gap-4 mb-6">
        <h6 className="text-xl">{nodeToEdit ? `Node Edition` : `Add Node`}</h6>
        <Button
          type="button"
          i={2}
          s={1}
          title="Close mindmap node adding"
          onClick={mindmapCreatorStoreActions.cancelAddingNode}
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
          <Tabs.Item
            active={type === `external`}
            onClick={() => setType(`external`)}
          >
            External
          </Tabs.Item>
        </Tabs>
      )}

      {type === `internal` && <InternalNodeFormContainer />}
      {type === `external` && <ExternalNodeFormContainer />}
    </Modal>
  );
};

export { NodeFormModalContainer };
