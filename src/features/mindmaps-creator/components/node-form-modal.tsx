import { Button } from 'design-system/button';
import Modal from 'design-system/modal';
import { Tabs } from 'design-system/tabs';
import React from 'react';
import { BiX } from 'react-icons/bi';
import {
  InternalNodeForm,
  type InternalNodeFormProps,
} from './internal-node-form';

type NodeFormModalProps = {
  onClose(): void;
  onConfirm: InternalNodeFormProps['onConfirm'];
};

const NodeFormModal = ({ onClose, onConfirm }: NodeFormModalProps) => {
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
          onClick={onClose}
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
      {type === `internal` && (
        <InternalNodeForm onClose={onClose} onConfirm={onConfirm} />
      )}
      {type === `external` && <div>External</div>}
    </Modal>
  );
};

export { NodeFormModal };
