import React, { type FormEventHandler } from 'react';
import { Field } from 'design-system/field';
import { Button } from 'design-system/button';
import { Input } from 'design-system/input';
import { Textarea } from 'design-system/textarea';
import type { MindmapExternalNode } from 'api-4markdown-contracts';
import { useForm } from 'development-kit/use-form';
import {
  mindmapCreatorStoreActions,
  mindmapCreatorStoreSelectors,
} from 'store/mindmap-creator/mindmap-creator.store';
import { nodeDescription, nodeName, nodeUrl } from '../core/validators';
import { useReactFlow } from '@xyflow/react';

type ExternalNodeFormValues = MindmapExternalNode['data'];

const ExternalNodeFormContainer = () => {
  const nodeToEdit = mindmapCreatorStoreSelectors.useExternalNodeToEdit();
  const { screenToFlowPosition } = useReactFlow();

  const [{ values, invalid }, { inject }] = useForm<ExternalNodeFormValues>(
    {
      name: nodeToEdit?.data.name ?? ``,
      description: nodeToEdit?.data.description ?? ``,
      url: nodeToEdit?.data.url ?? ``,
    },
    {
      name: nodeName,
      description: nodeDescription,
      url: nodeUrl,
    },
  );

  const confirm: FormEventHandler<HTMLFormElement> = (e): void => {
    e.preventDefault();

    if (nodeToEdit) {
      mindmapCreatorStoreActions.editExternalNode(nodeToEdit.id, values);
      return;
    }

    mindmapCreatorStoreActions.addExternalNode(
      values,
      screenToFlowPosition(mindmapCreatorStoreSelectors.mousePosition()),
    );
  };

  return (
    <form onSubmit={confirm}>
      <section>
        <Field className="mb-2" label="Name*">
          <Input placeholder="Example: Pizza recipe" {...inject(`name`)} />
        </Field>
        <Field className="mb-2" label="URL*">
          <Input
            placeholder="Example: https://link-to-article.com"
            {...inject(`url`)}
          />
        </Field>
        <Field label="Description">
          <Textarea
            placeholder="Example: All pizza dough starts with the same basic ingredients: flour, yeast, water, salt, and olive oil..."
            {...inject(`description`)}
          />
        </Field>
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

export { ExternalNodeFormContainer };
