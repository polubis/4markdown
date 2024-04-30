import React from 'react';
import { Tabs } from 'design-system/tabs';
import { Field } from 'design-system/field';
import { Button } from 'design-system/button';
import { DocumentSearchSelectContainer } from '../containers/document-search-select.container';
import { Doc } from 'models/doc';
import { Input } from 'design-system/input';
import { Textarea } from 'design-system/textarea';
import Modal from 'design-system/modal';
import type { InternalMindmapNode } from 'models/mindmap';
import { BiX } from 'react-icons/bi';

interface NodeFormModalProps {
  onConfirm(node: Pick<InternalMindmapNode, 'data' | 'type'>): void;
  onClose(): void;
}

const validators = {
  name: (name: string): boolean =>
    typeof name === `string` &&
    name.length === name.trim().length &&
    name.length >= 2 &&
    name.length <= 100 &&
    /^[a-zA-Z0-9]+(?:\s[a-zA-Z0-9]+)*$/.test(name.trim()),
  description: (description: string): boolean =>
    typeof description === `string` &&
    description.length === description.trim().length &&
    description.length >= 10 &&
    description.length <= 250,
};

const InternalForm = ({ onClose, onConfirm }: NodeFormModalProps) => {
  const [selectedDoc, setSelectedDoc] = React.useState<Doc | null>(null);
  const [name, setName] = React.useState(``);
  const [description, setDescription] = React.useState(``);

  const confirm: React.FormEventHandler<HTMLFormElement> = (e): void => {
    e.preventDefault();

    onConfirm({
      type: `internal`,
      data: { name, description, doc: selectedDoc! },
    });
  };

  const selectDoc = (doc: Doc): void => {
    setSelectedDoc(doc);
    setName(doc.name);
    doc.visibility === `permanent` && setDescription(doc.visibility);
  };

  const unselectDoc = (): void => {
    setSelectedDoc(null);
  };

  const isNameValid = React.useMemo(() => validators.name(name), [name]);
  const isDescriptionValid = React.useMemo(
    () => validators.description(description),
    [description],
  );

  return (
    <form onSubmit={confirm}>
      <section>
        <Field
          className="mb-2"
          label="Document*"
          hint={
            selectedDoc ? (
              <>
                You selected <strong>{selectedDoc.name}</strong>
              </>
            ) : (
              <>Select the document</>
            )
          }
        >
          <DocumentSearchSelectContainer
            onSelect={selectDoc}
            onChange={unselectDoc}
          />
        </Field>
        {selectedDoc && (
          <>
            <Field className="mb-2" label="Name*">
              <Input
                placeholder="Example: Pizza recipe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>
            <Field label="Description*">
              <Textarea
                placeholder="Example: All pizza dough starts with the same basic ingredients: flour, yeast, water, salt, and olive oil..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Field>
          </>
        )}
      </section>
      <footer className="mt-8 flex space-x-2 justify-end">
        <Button
          type="button"
          i={1}
          s={2}
          auto
          title="Cancel node creation"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          disabled={!isNameValid || !isDescriptionValid}
          type="submit"
          i={2}
          s={2}
          auto
          title="Confirm node creation"
        >
          Confirm
        </Button>
      </footer>
    </form>
  );
};

const NodeFormModal = (props: NodeFormModalProps) => {
  const [type, setType] = React.useState<`internal` | `external`>(`internal`);

  return (
    <Modal>
      <div className="flex items-center justify-between gap-4 mb-6">
        <h6 className="text-xl">Add Node</h6>
        <Button
          type="button"
          i={2}
          s={1}
          title="Close new node add"
          onClick={props.onClose}
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
      {type === `internal` && <InternalForm {...props} />}
    </Modal>
  );
};

export type { NodeFormModalProps };
export default NodeFormModal;
