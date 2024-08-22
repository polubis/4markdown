import React from 'react';
import { Field } from 'design-system/field';
import { Button } from 'design-system/button';
import { Input } from 'design-system/input';
import { Textarea } from 'design-system/textarea';
import type { DocumentDto } from 'api-4markdown-contracts';
import { YourDocumentsSearchContainer } from './your-documents-search.container';
import {
  addInternalMindmapNode,
  cancelAddingNode,
} from 'store/mindmaps-creator/mindmaps-creator.actions';

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

const InternalNodeFormContainer = () => {
  const [selectedDoc, setSelectedDoc] = React.useState<DocumentDto | null>(
    null,
  );
  const [name, setName] = React.useState(``);
  const [description, setDescription] = React.useState(``);

  const confirm: React.FormEventHandler<HTMLFormElement> = (e): void => {
    e.preventDefault();

    addInternalMindmapNode({
      name,
      description,
      document: selectedDoc!,
    });
  };

  const selectDoc = (doc: DocumentDto): void => {
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
        <Field className="mb-2" label="Document*">
          <YourDocumentsSearchContainer
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
          onClick={cancelAddingNode}
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

export { InternalNodeFormContainer };
