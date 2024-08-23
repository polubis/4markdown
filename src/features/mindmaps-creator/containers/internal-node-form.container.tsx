import React from 'react';
import { Field } from 'design-system/field';
import { Button } from 'design-system/button';
import { Input } from 'design-system/input';
import { Textarea } from 'design-system/textarea';
import type { DocumentDto, MindmapInternalNode } from 'api-4markdown-contracts';
import { YourDocumentsSearchContainer } from './your-documents-search.container';
import {
  addInternalMindmapNode,
  cancelAddingNode,
} from 'store/mindmaps-creator/mindmaps-creator.actions';
import { useForm } from 'development-kit/use-form';
import {
  maxLength,
  minLength,
  name,
  noEdgeSpaces,
  optional,
} from 'development-kit/form';

type InternalNodeFormValues = Pick<
  MindmapInternalNode['data'],
  'name' | 'description'
>;

const InternalNodeFormContainer = () => {
  const [selectedDoc, setSelectedDoc] = React.useState<DocumentDto | null>(
    null,
  );

  const [{ values, invalid }, { set, inject }] =
    useForm<InternalNodeFormValues>(
      {
        name: ``,
        description: ``,
      },
      {
        name: [noEdgeSpaces, minLength(2), maxLength(100), name],
        description: [optional(noEdgeSpaces, maxLength(250))],
      },
    );

  const confirm: React.FormEventHandler<HTMLFormElement> = (e): void => {
    e.preventDefault();

    addInternalMindmapNode({
      name: values.name,
      description: values.description,
      document: selectedDoc!,
    });
  };

  const selectDoc = (doc: DocumentDto): void => {
    setSelectedDoc(doc);
    set({ name: doc.name });
    doc.visibility === `permanent` && set({ description: doc.description });
  };

  const unselectDoc = (): void => {
    setSelectedDoc(null);
  };

  return (
    <form onSubmit={confirm}>
      <section>
        <Field className="mb-2" label="Document*">
          <YourDocumentsSearchContainer
            onSelect={selectDoc}
            onChange={unselectDoc}
          />
        </Field>
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
          onClick={cancelAddingNode}
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
