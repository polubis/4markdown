import React from 'react';
import { type NodeProps } from 'reactflow';
import { useMindmapsCreatorCtx } from '../providers/mindmaps-creator.provider';
import { Tabs } from 'design-system/tabs';
import { Field } from 'design-system/field';
import { Button } from 'design-system/button';
import { DocumentSearchSelectContainer } from './document-search-select.container';
import { Doc } from 'models/doc';
import { Input } from 'design-system/input';
import { Textarea } from 'design-system/textarea';

interface InitialNodeContainerProps extends NodeProps {}

const validators = {
  name: (name: string): boolean =>
    typeof name === `string` &&
    name.length === name.trim().length &&
    name.length >= 2 &&
    name.length <= 100 &&
    /^[a-zA-Z0-9]+(?:\s[a-zA-Z0-9]+)*$/.test(name.trim()),
  description: (description: string): boolean => {
    if (typeof description !== `string`) {
      return false;
    }

    return (
      description.length === description.trim().length &&
      description.length >= 10 &&
      description.length <= 250
    );
  },
};

const InitialNodeContainer = (props: InitialNodeContainerProps) => {
  const [type, setType] = React.useState<`yours` | `external`>(`yours`);
  const [selectedDoc, setSelectedDoc] = React.useState<Doc | null>(null);
  const [name, setName] = React.useState(``);
  const [description, setDescription] = React.useState(``);

  const { setNodes, setOperation } = useMindmapsCreatorCtx();

  const cancel = (): void => {
    setNodes((nodes) => nodes.filter((node) => node.id !== props.id));
  };

  const confirm: React.FormEventHandler<HTMLFormElement> = (e): void => {
    e.preventDefault();

    setOperation(`node-added`);
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === props.id ? { ...node, type: `internal` } : node,
      ),
    );
    setOperation(`idle`, 3000);
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
    <form
      className="bg-zinc-200 dark:bg-gray-950 border-zinc-300 dark:border-zinc-800 p-4 rounded-md border max-w-[280px]"
      onSubmit={confirm}
    >
      <h6 className="text-xl mb-4">Add Node</h6>
      <section>
        <Tabs className="mb-5">
          <Tabs.Item
            type="button"
            active={type === `yours`}
            onClick={() => setType(`yours`)}
          >
            Yours
          </Tabs.Item>
          <Tabs.Item
            type="button"
            active={type === `external`}
            onClick={() => setType(`external`)}
          >
            External
          </Tabs.Item>
        </Tabs>
        {type === `yours` && (
          <>
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
          onClick={cancel}
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

export { InitialNodeContainer };
