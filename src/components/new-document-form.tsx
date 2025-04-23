import React, { type ReactNode, type FormEventHandler } from 'react';
import { Button } from 'design-system/button';
import { BiInfoCircle, BiPlusCircle } from 'react-icons/bi';
import { Input } from 'design-system/input';
import { useForm } from 'development-kit/use-form';
import type { API4MarkdownPayload } from 'api-4markdown-contracts';
import { Field } from 'design-system/field';
import { Hint } from 'design-system/hint';
import { context } from '@greenonsoftware/react-kit';
import { Textarea } from 'design-system/textarea';
import { AI_CONTENT_GENERATION_TOKEN_COST } from 'core/consts';
import { chain, maxLength, minLength } from 'development-kit/form';

type AIFormValues = Pick<
  API4MarkdownPayload<'createContentWithAI'>,
  'name' | 'description' | 'profession' | 'sample' | 'structure'
> & {
  style: string;
};

type ManualFormValues = Pick<API4MarkdownPayload<'createDocument'>, 'name'>;

type OnSubmit = (
  payload:
    | { variant: `ai`; values: AIFormValues }
    | { variant: `manual`; values: ManualFormValues },
) => void;

type NewDocumentFormProps = {
  disabled?: boolean;
  variant: 'ai' | 'manual';
  renderFooter?: (
    props: NewDocumentFormProps,
    payload: Parameters<OnSubmit>[0] & {
      untouched: boolean;
      invalid: boolean;
    },
  ) => ReactNode;
  onBack(): void;
  onSubmit: OnSubmit;
};

const [FormProvider, useFormContext] = context(
  (props: NewDocumentFormProps) => props,
);

const limits = {
  name: {
    min: 1,
    max: 70,
  },
} as const;

const ManualForm = () => {
  const ctx = useFormContext();

  const [{ invalid, values, untouched }, { inject }] =
    useForm<ManualFormValues>(
      { name: `` },
      {
        name: [
          (value) =>
            chain(
              minLength(limits.name.min),
              maxLength(limits.name.max),
            )(value.trim()),
        ],
      },
    );

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (ctx.variant !== `manual`) {
      throw Error(`Invalid variant submission detected`);
    }

    ctx.onSubmit({ values, variant: `manual` });
  };

  return (
    <form className="flex flex-col" onSubmit={handleSubmit}>
      <Field
        label={
          <Field.Label label="Document Name" value={values.name} required />
        }
        hint={
          <Hint
            trigger={`Any characters, between ${limits.name.min} to ${limits.name.max} characters`}
          />
        }
      >
        <Input
          placeholder={`My Notes, Basics of Computer Science, ...etc`}
          {...inject(`name`)}
        />
      </Field>
      {ctx.renderFooter ? (
        ctx.renderFooter(ctx, { values, variant: `manual`, untouched, invalid })
      ) : (
        <footer className="flex space-x-3 [&_button]:flex-1 mt-8">
          <Button
            s={2}
            i={1}
            type="button"
            title="Back to document type selection"
            auto
            disabled={ctx.disabled}
            onClick={ctx.onBack}
          >
            Back
          </Button>
          <Button
            type="submit"
            i={2}
            s={2}
            auto
            title="Confirm document creation"
            disabled={untouched || invalid || ctx.disabled}
          >
            Create
            <BiPlusCircle />
          </Button>
        </footer>
      )}
    </form>
  );
};

const AIForm = () => {
  const ctx = useFormContext();

  const [{ invalid, values, untouched }, { inject }] = useForm<AIFormValues>({
    name: ``,
    description: ``,
    style: ``,
    structure: ``,
    sample: ``,
    profession: ``,
  });

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    ctx.onSubmit({ values, variant: `ai` });
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
        <Field label="Name*">
          <Input placeholder={`My Notes, Basics of Math`} {...inject(`name`)} />
        </Field>
        <Field label="Description*">
          <Textarea
            placeholder="Let's explore the basics of computer science through a step-by-step guide filled with plenty of examples"
            {...inject(`description`)}
          />
        </Field>
        <Field label="Profession*">
          <Input
            placeholder="Developer if writing about programming and so on"
            {...inject(`profession`)}
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
              trigger={<>Use &quot;#&quot; symbols to create hierarchy</>}
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
        <div className="flex items-center gap-1.5 rounded-md p-2 bg-zinc-200 border dark:bg-gray-950 border-zinc-300 dark:border-zinc-800">
          <BiInfoCircle size={20} className="shrink-0" />
          <p>
            Generation will take{` `}
            <strong>{AI_CONTENT_GENERATION_TOKEN_COST} tokens</strong>
          </p>
        </div>
        {ctx.renderFooter ? (
          ctx.renderFooter(ctx, { values, variant: `ai`, untouched, invalid })
        ) : (
          <footer className="flex space-x-3 [&_button]:flex-1 mt-4">
            <Button
              s={2}
              i={1}
              type="button"
              title="Back to document type selection"
              auto
              disabled={ctx.disabled}
              onClick={ctx.onBack}
            >
              Back
            </Button>
            <Button
              type="submit"
              i={2}
              s={2}
              auto
              title="Confirm document creation with AI"
              disabled={untouched || invalid || ctx.disabled}
            >
              Create
              <BiPlusCircle />
            </Button>
          </footer>
        )}
      </div>
    </form>
  );
};

const NewDocumentForm = () => {
  const ctx = useFormContext();

  switch (ctx.variant) {
    case `ai`:
      return <AIForm />;
    case `manual`:
      return (
        <>
          <p className="mb-4">
            Document will be created in <strong>private</strong> mode. Visible
            only to you, but <strong>not encrypted</strong>—avoid sensitive data
          </p>
          <ManualForm />
        </>
      );
    default:
      throw Error(`Invalid variant detected`);
  }
};

const ConnectedNewDocumentForm = (props: NewDocumentFormProps) => {
  return (
    <FormProvider {...props}>
      <NewDocumentForm />
    </FormProvider>
  );
};

export type { NewDocumentFormProps };
export { ConnectedNewDocumentForm as NewDocumentForm };
