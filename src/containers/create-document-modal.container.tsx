import React, { type FormEventHandler } from 'react';
import { Button } from 'design-system/button';
import { BiPlusCircle } from 'react-icons/bi';
import { useDocManagementStore } from 'store/doc-management/doc-management.store';
import { Input } from 'design-system/input';
import { useForm } from 'development-kit/use-form';
import type { API4MarkdownPayload } from 'api-4markdown-contracts';
import { Field } from 'design-system/field';
import { Hint } from 'design-system/hint';
import { Modal } from 'design-system/modal';
import { context } from '@greenonsoftware/react-kit';
import { createDocumentAct } from 'acts/create-document.act';
import { Textarea } from 'design-system/textarea';

type CreateDocumentModalContainerProps = {
  onClose(): void;
};

const [CreateDocumentProvider, useCreateDocumentContext] = context(
  ({ onClose }: CreateDocumentModalContainerProps) => {
    const [activeType, setActiveType] = React.useState<
      `ai` | `manual` | `none`
    >(`none`);

    return { activeType, setActiveType, onClose };
  },
);

const ManualFormContainer = () => {
  const { onClose, setActiveType } = useCreateDocumentContext();

  const docManagementStore = useDocManagementStore();

  const [{ invalid, values, untouched }, { inject }] = useForm<
    Pick<API4MarkdownPayload<'createDocument'>, 'name'>
  >({ name: `` });

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if ((await createDocumentAct(values)).is === `ok`) {
      onClose();
    }
  };

  return (
    <form className="flex flex-col" onSubmit={handleSubmit}>
      <Field
        label="Name*"
        hint={
          <Hint
            trigger={
              <>
                Document will be created in <strong>private</strong> mode.
                Visible only to you, but <strong>not encrypted</strong> - avoid
                sensitive data
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
      <footer className="flex space-x-3 [&_button]:flex-1 mt-8">
        <Button
          s={2}
          i={1}
          type="button"
          title="Back to document type selection"
          auto
          onClick={() => setActiveType(`none`)}
        >
          Back
        </Button>
        <Button
          type="submit"
          i={2}
          s={2}
          auto
          title="Confirm document creation"
          disabled={untouched || invalid || docManagementStore.is === `busy`}
        >
          Create
          <BiPlusCircle />
        </Button>
      </footer>
    </form>
  );
};

type FormValues = Pick<
  API4MarkdownPayload<'createContentWithAI'>,
  'name' | 'description' | 'role' | 'sample'
> & {
  style: string;
  structure: string;
};

const AIFormContainer = () => {
  const { onClose, setActiveType } = useCreateDocumentContext();

  const docManagementStore = useDocManagementStore();

  const [{ invalid, values, untouched }, { inject }] = useForm<FormValues>({
    name: ``,
    description: ``,
    style: ``,
    structure: ``,
    sample: ``,
    role: ``,
  });

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if ((await createDocumentAct(values)).is === `ok`) {
      onClose();
    }
  };

  const splittedStyle = React.useMemo(
    () =>
      values.style
        .split(`,`)
        .map((styleEntry) => styleEntry.trim())
        .filter((styleEntry) => styleEntry.length > 0).length,
    [values.style],
  );

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-3">
        <Field
          label="Name*"
          hint={
            <Hint
              trigger={
                <>
                  Document will be created in <strong>private</strong> mode.
                  Visible only to you, but <strong>not encrypted</strong> -
                  avoid sensitive data
                </>
              }
            />
          }
        >
          <Input placeholder={`My Notes, Basics of Math`} {...inject(`name`)} />
        </Field>
        <Field label="Description*">
          <Textarea
            placeholder="Let's explore the basics of computer science through a step-by-step guide filled with plenty of examples"
            {...inject(`description`)}
          />
        </Field>
        <Field label="Role*">
          <Input
            placeholder="Developer if writing about programming and so on"
            {...inject(`role`)}
          />
        </Field>
        <Field
          label={splittedStyle === 0 ? `Style*` : `Style (${splittedStyle})*`}
        >
          <Input placeholder="soft, edgy, smart" {...inject(`style`)} />
        </Field>
        <Field
          label="Structure*"
          hint={
            <Hint
              trigger={
                <>Each new line is a topic, use # symbols to create hierarchy</>
              }
            />
          }
        >
          <Textarea
            placeholder={`# ${values.name ? values.name : `My Notes, Basics of Math`}\n## Introduction to Math\n### Basic Operations\n#### Algebra\n#### Geometry\n#### Calculus\n## Conclusion`}
            {...inject(`structure`)}
          />
        </Field>
        <Field label="Sample*">
          <Textarea
            placeholder="A fragment from another article, document, or note to help match your writing style"
            {...inject(`sample`)}
          />
        </Field>
        <footer className="flex space-x-3 [&_button]:flex-1 mt-8">
          <Button
            s={2}
            i={1}
            type="button"
            title="Back to document type selection"
            auto
            onClick={() => setActiveType(`none`)}
          >
            Back
          </Button>
          <Button
            type="submit"
            i={2}
            s={2}
            auto
            title="Confirm document creation with AI"
            disabled={untouched || invalid || docManagementStore.is === `busy`}
          >
            Create
            <BiPlusCircle />
          </Button>
        </footer>
      </div>
    </form>
  );
};

const CreateDocumentModalContainer = () => {
  const { onClose, activeType, setActiveType } = useCreateDocumentContext();

  const docManagementStore = useDocManagementStore();

  return (
    <Modal disabled={docManagementStore.is === `busy`} onClose={onClose}>
      <Modal.Header
        title="Create Document"
        closeButtonTitle="Close document adding"
      />

      {activeType === `none` && (
        <>
          <section className="flex flex-col gap-3">
            <button
              className="flex flex-col cursor-pointer hover:bg-zinc-300 dark:hover:bg-gray-900 p-3 rounded-md bg-zinc-200 border dark:bg-gray-950 border-zinc-300 dark:border-zinc-800"
              onClick={() => setActiveType(`manual`)}
            >
              <h6 className="capitalize text-left">Setup Things Manually</h6>
              <p className="mt-1 text-sm text-left">
                Adding document by providing its name
              </p>
            </button>
            <button
              className="flex flex-col cursor-pointer hover:bg-zinc-300 dark:hover:bg-gray-900 p-3 rounded-md bg-zinc-200 border dark:bg-gray-950 border-zinc-300 dark:border-zinc-800"
              onClick={() => setActiveType(`ai`)}
            >
              <h6 className="capitalize text-left">Generate With AI</h6>
              <p className="mt-1 text-sm text-left">
                Use AI to generate document. Provide structure, metadata and
                voilà!
              </p>
            </button>
          </section>
        </>
      )}

      {activeType === `manual` && <ManualFormContainer />}

      {activeType === `ai` && <AIFormContainer />}
    </Modal>
  );
};

const ConnectedCreateDocumentModalContainer = (
  props: CreateDocumentModalContainerProps,
) => {
  return (
    <CreateDocumentProvider {...props}>
      <CreateDocumentModalContainer />
    </CreateDocumentProvider>
  );
};

export { ConnectedCreateDocumentModalContainer as CreateDocumentModalContainer };
