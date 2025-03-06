import { Modal } from 'design-system/modal';
import type { ComponentType, FormEventHandler } from 'react';
import React from 'react';
import { useForm } from 'development-kit/use-form';
import { maxLength, minLength, optional, url } from 'development-kit/form';
import { Field } from 'design-system/field';
import { Hint } from 'design-system/hint';
import { Input } from 'design-system/input';
import { Textarea } from 'design-system/textarea';
import { Button } from 'design-system/button';
import { BiPlusCircle } from 'react-icons/bi';
import { context } from 'development-kit/context';
import { type MindmapCreatorNode } from 'store/mindmap-creator/models';
import {
  addNewEmbeddedNodeAction,
  addNewExternalNodeAction,
  closeNodeFormAction,
} from 'store/mindmap-creator/actions';
import { validationLimits } from '../core/validation';

const [LocalProvider, useLocalContext] = context(() => {
  const [activeType, setActiveType] = React.useState<
    MindmapCreatorNode['type'] | null
  >(null);

  return {
    activeType,
    setActiveType,
  };
});

const ExternalForm = () => {
  const { setActiveType } = useLocalContext();

  const [{ values, untouched, invalid }, { inject }] = useForm(
    {
      name: ``,
      description: ``,
      url: ``,
    },
    {
      name: [
        minLength(validationLimits.name.min),
        maxLength(validationLimits.name.max),
      ],
      description: [
        optional(
          minLength(validationLimits.description.min),
          maxLength(validationLimits.description.max),
        ),
      ],
      url: [url],
    },
  );

  const confirmCreation: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const name = values.name.trim();
    const description = values.description.trim();
    const url = values.url.trim();

    addNewExternalNodeAction({
      name,
      description: description.length === 0 ? null : description,
      url,
      path: `/unset/`,
    });
  };

  return (
    <>
      <Modal.Header
        title="External node data (2/2)"
        closeButtonTitle="Cancel node creation"
      />
      <form className="flex flex-col gap-3" onSubmit={confirmCreation}>
        <Field
          label="Name*"
          hint={
            <Hint
              trigger={
                <>
                  {validationLimits.name.min} - {validationLimits.name.max}
                  {` `}
                  characters
                </>
              }
            />
          }
        >
          <Input
            placeholder={`My Notes, Basics of Computer Science, ...etc`}
            {...inject(`name`)}
          />
        </Field>
        <Field
          label="Description"
          hint={
            <Hint
              trigger={
                <>
                  {validationLimits.description.min} -{` `}
                  {validationLimits.description.max}
                  {` `}
                  characters
                </>
              }
            />
          }
        >
          <Textarea
            placeholder="My handy description for learning something valuable..."
            {...inject(`description`)}
          />
        </Field>
        <Field label="Link To Resource*">
          <Input
            placeholder={`https://cool-articles.com/article/`}
            {...inject(`url`)}
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

const EmbeddedForm = () => {
  const { setActiveType } = useLocalContext();
  const [{ values, untouched, invalid }, { inject }] = useForm(
    {
      name: ``,
      description: ``,
      content: ``,
    },
    {
      name: [
        minLength(validationLimits.name.min),
        maxLength(validationLimits.name.max),
      ],
      description: [
        optional(
          minLength(validationLimits.description.min),
          maxLength(validationLimits.description.max),
        ),
      ],
    },
  );

  const confirmCreation: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const name = values.name.trim();
    const description = values.description.trim();
    const content = values.content.trim();

    addNewEmbeddedNodeAction({
      name,
      description: description.length === 0 ? null : description,
      content,
      path: `/unset/`,
    });
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
                  {validationLimits.name.min} - {validationLimits.name.max}
                  {` `}
                  characters
                </>
              }
            />
          }
        >
          <Input
            placeholder={`My Notes, Basics of Computer Science, ...etc`}
            {...inject(`name`)}
          />
        </Field>
        <Field
          label="Description"
          hint={
            <Hint
              trigger={
                <>
                  {validationLimits.description.min} -{` `}
                  {validationLimits.description.max}
                  {` `}
                  characters
                </>
              }
            />
          }
        >
          <Textarea
            placeholder="My handy description for learning something valuable..."
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

const forms: Record<MindmapCreatorNode['type'], ComponentType> = {
  embedded: EmbeddedForm,
  external: ExternalForm,
};

const FormRenderer = ({ type }: Pick<MindmapCreatorNode, 'type'>) => {
  const Component = forms[type];
  return <Component />;
};

const NodeFormModalContainer = () => {
  const { activeType, setActiveType } = useLocalContext();

  return (
    <Modal onClose={closeNodeFormAction}>
      {activeType === null ? (
        <>
          <Modal.Header
            title="Select Node Type (1/2)"
            closeButtonTitle="Cancel node creation"
          />
          <section className="flex flex-col gap-3">
            <button
              className="flex flex-col cursor-pointer hover:bg-zinc-300 dark:hover:bg-gray-900 p-3 rounded-md bg-zinc-200 border dark:bg-gray-950 border-zinc-300 dark:border-zinc-800"
              onClick={() => setActiveType(`embedded`)}
            >
              <h6 className="capitalize text-left">Embedded Node</h6>
              <p className="mt-1 text-sm text-left">
                Add node and its content from scratch
              </p>
            </button>
            <button
              className="flex flex-col cursor-pointer hover:bg-zinc-300 dark:hover:bg-gray-900 p-3 rounded-md bg-zinc-200 border dark:bg-gray-950 border-zinc-300 dark:border-zinc-800"
              onClick={() => setActiveType(`external`)}
            >
              <h6 className="capitalize text-left">External Node</h6>
              <p className="mt-1 text-sm text-left">
                Link external resource as mindmap node
              </p>
            </button>
          </section>
        </>
      ) : (
        <FormRenderer type={activeType} />
      )}
    </Modal>
  );
};

const ConnectedNewNodeModalContainer = () => (
  <LocalProvider>
    <NodeFormModalContainer />
  </LocalProvider>
);

export { ConnectedNewNodeModalContainer as NodeFormModalContainer };
