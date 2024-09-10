import React from 'react';
import { Field } from 'design-system/field';
import { Button } from 'design-system/button';
import { Input } from 'design-system/input';
import { Textarea } from 'design-system/textarea';
import type { MindmapInternalNode } from 'api-4markdown-contracts';
import { YourDocumentsSearchContainer } from './your-documents-search.container';
import { useForm } from 'development-kit/use-form';
import {
  maxLength,
  minLength,
  name,
  noEdgeSpaces,
  optional,
} from 'development-kit/form';
import { meta } from '../../../../meta';
import { Hint } from 'design-system/hint';
import {
  mindmapCreatorStoreActions,
  mindmapCreatorStoreSelectors,
} from 'store/mindmap-creator/mindmap-creator.store';
import { useReactFlow } from '@xyflow/react';

type InternalNodeFormValues = Pick<
  MindmapInternalNode['data'],
  'name' | 'description'
>;

const InternalNodeFormContainer = () => {
  const nodeToEdit = mindmapCreatorStoreSelectors.useInternalNodeToEdit();
  const [selectedDoc, setSelectedDoc] = React.useState<
    MindmapInternalNode['data']['document'] | undefined
  >(nodeToEdit?.data.document);

  const { screenToFlowPosition } = useReactFlow();

  const [{ values, invalid }, { set, inject }] =
    useForm<InternalNodeFormValues>(
      {
        name: nodeToEdit?.data.name ?? ``,
        description: nodeToEdit?.data.description ?? ``,
      },
      {
        name: [noEdgeSpaces, minLength(2), maxLength(100), name],
        description: [optional(noEdgeSpaces, maxLength(250))],
      },
    );

  const confirm: React.FormEventHandler<HTMLFormElement> = (e): void => {
    e.preventDefault();

    if (nodeToEdit) {
      mindmapCreatorStoreActions.editInternalNode(nodeToEdit.id, {
        name: values.name,
        description: values.description,
        document: selectedDoc!,
      });
      return;
    }

    mindmapCreatorStoreActions.addInternalNode(
      {
        name: values.name,
        description: values.description,
        document: selectedDoc!,
      },
      screenToFlowPosition(mindmapCreatorStoreSelectors.mousePosition()),
    );
  };

  const selectDoc = (doc: MindmapInternalNode['data']['document']): void => {
    setSelectedDoc(doc);
    set({ name: doc.name });
    doc.visibility === `permanent` && set({ description: doc.description });
  };

  const unselectDoc = (): void => {
    setSelectedDoc(undefined);
  };

  return (
    <form onSubmit={confirm}>
      <section>
        {nodeToEdit ? null : (
          <Field
            className="mb-2"
            label="Document*"
            hint={
              <Hint
                trigger={`Find a non-private document in ${meta.appName}`}
              />
            }
          >
            <YourDocumentsSearchContainer
              onSelect={selectDoc}
              onChange={unselectDoc}
            />
          </Field>
        )}
        {selectedDoc && (
          <>
            <Field className="mb-2" label="Name*">
              <Input placeholder="Example: Pizza recipe" {...inject(`name`)} />
            </Field>
            <Field label="Description">
              <Textarea
                placeholder="Example: All pizza dough starts with the same basic ingredients: flour, yeast, water, salt, and olive oil..."
                {...inject(`description`)}
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
          onClick={mindmapCreatorStoreActions.cancelAddingNode}
        >
          Cancel
        </Button>
        <Button
          disabled={invalid}
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

export { InternalNodeFormContainer };
