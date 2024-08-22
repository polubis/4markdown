import { Button } from 'design-system/button';
import Modal from 'design-system/modal';
import { Tabs } from 'design-system/tabs';
import React from 'react';
import { BiX } from 'react-icons/bi';
import { InternalNodeForm } from './internal-node-form';
import { cancelAddingNode } from 'store/mindmaps-creator/mindmaps-creator.actions';

const NodeFormModal = () => {
  const [type, setType] = React.useState<`internal` | `external`>(`internal`);

  return (
    <Modal>
      <div className="flex items-center justify-between gap-4 mb-6">
        <h6 className="text-xl">Add Node</h6>
        <Button
          type="button"
          i={2}
          s={1}
          title="Close mindmap node adding"
          onClick={cancelAddingNode}
        >
          <BiX />
        </Button>
      </div>
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
      {type === `internal` && <InternalNodeForm />}
      {type === `external` && <div>External</div>}
    </Modal>
  );
};

export { NodeFormModal };
