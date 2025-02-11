import { Modal } from 'design-system/modal';
import type { ComponentType, FormEventHandler } from 'react';
import React from 'react';
import { useMindmapModalsContext } from '../providers/mindmap-widgets.provider';
import {
  MINDMAP_NODE_TYPES,
  type MindmapNodeType,
} from 'api-4markdown-contracts';
import { meta } from '../../../../meta';
import { useForm } from 'development-kit/use-form';
import { maxLength, minLength, optional } from 'development-kit/form';
import { Field } from 'design-system/field';
import { Hint } from 'design-system/hint';
import { Input } from 'design-system/input';
import { Textarea } from 'design-system/textarea';
import { Button } from 'design-system/button';
import { BiPlusCircle } from 'react-icons/bi';
import { addNewNodeAction } from 'store/mindmap-creator/actions';
import { context } from 'development-kit/context';

const [LocalProvider, useLocalContext] = context(() => {
  const [activeType, setActiveType] = React.useState<MindmapNodeType | null>(
    null,
  );

  return {
    activeType,
    setActiveType,
  };
});

const descriptions: Record<MindmapNodeType, string> = {
  document: `Create node from ${meta.appName} document`,
  embedded: `Add node and its content from scratch`,
  external: `Link external resource as mindmap node`,
  nested: `Connect other mindmap as node`,
};

const limits = {
  name: {
    min: 1,
    max: 70,
  },
  descrition: {
    min: 110,
    max: 160,
  },
} as const;

const EmbeddedForm = () => {
  const { nodeCreation } = useMindmapModalsContext();
  const { setActiveType } = useLocalContext();
  const [{ values, untouched, invalid }, { inject }] = useForm(
    {
      name: ``,
      description: ``,
      content: ``,
    },
    {
      name: [minLength(limits.name.min), maxLength(limits.name.max)],
      description: [
        optional(
          minLength(limits.descrition.min),
          maxLength(limits.descrition.max),
        ),
      ],
    },
  );

  const confirmCreation: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const name = values.name.trim();
    const description = values.description.trim();
    const content = values.content.trim();

    addNewNodeAction(`embedded`, {
      name,
      description: description.length === 0 ? null : description,
      content,
      loading: false,
    });
    nodeCreation.off();
  };

  return (
    <>
      <Modal.Header
        title="Embedded node data (2/2)"
        closeButtonTitle="Cancel node creation"
      />
      <form className="flex flex-col gap-3" onSubmit={confirmCreation}>
        <Field
          label="Name*"
          hint={
            <Hint
              trigger={
                <>
                  {limits.name.min} - {limits.name.max}
                  {` `}
                  characters
                </>
              }
            />
          }
        >
          <Input
            placeholder={`My Mindmap, Basics of Computer Science, ...etc`}
            {...inject(`name`)}
          />
        </Field>
        <Field
          label="Description"
          hint={
            <Hint
              trigger={
                <>
                  {limits.descrition.min} - {limits.descrition.max}
                  {` `}
                  characters
                </>
              }
            />
          }
        >
          <Textarea
            placeholder="My private or public roadmap for learning something important to me..."
            {...inject(`description`)}
          />
        </Field>
        <Field
          label="Content"
          hint={
            <Hint
              trigger={
                <>
                  You can use <strong>markdown syntax</strong> here
                </>
              }
            />
          }
        >
          <Textarea
            placeholder="The article, note or something you want to learn from..."
            {...inject(`content`)}
          />
        </Field>
        <footer className="flex space-x-3 mt-6">
          <Button
            type="button"
            i={1}
            className="flex-1"
            s={2}
            auto
            title="Back to node type selection"
            onClick={() => setActiveType(null)}
          >
            Back
          </Button>
          <Button
            type="submit"
            className="flex-1"
            i={2}
            s={2}
            auto
            title="Confirm node creation"
            disabled={untouched || invalid}
          >
            Create
            <BiPlusCircle />
          </Button>
        </footer>
      </form>
    </>
  );
};

const forms: Record<MindmapNodeType, ComponentType> = {
  document: EmbeddedForm,
  embedded: EmbeddedForm,
  external: EmbeddedForm,
  nested: EmbeddedForm,
};

const FormRenderer = ({ type }: { type: MindmapNodeType }) => {
  const Component = forms[type];
  return <Component />;
};

const CreateNodeModalContainer = () => {
  const { nodeCreation } = useMindmapModalsContext();
  const { activeType, setActiveType } = useLocalContext();

  return (
    <Modal disabled={false} onClose={nodeCreation.off}>
      {activeType === null ? (
        <>
          <Modal.Header
            title="Select Node Type (1/2)"
            closeButtonTitle="Cancel node creation"
          />

          <section className="flex flex-col gap-3">
            {MINDMAP_NODE_TYPES.map((type) => (
              <button
                className="flex flex-col cursor-pointer hover:bg-zinc-300 dark:hover:bg-gray-900 p-3 rounded-md bg-zinc-200 border dark:bg-gray-950 border-zinc-300 dark:border-zinc-800"
                key={type}
                onClick={() => setActiveType(type)}
              >
                <h6 className="capitalize text-left">{type}</h6>
                <p className="mt-1 text-sm text-left">{descriptions[type]}</p>
              </button>
            ))}
          </section>
        </>
      ) : (
        <FormRenderer type={activeType} />
      )}
    </Modal>
  );
};

const ConnectedCreateNodeModalContainer = () => (
  <LocalProvider>
    <CreateNodeModalContainer />
  </LocalProvider>
);

export { ConnectedCreateNodeModalContainer as CreateNodeModalContainer };
