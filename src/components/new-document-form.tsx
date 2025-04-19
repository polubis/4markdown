import React, { type FormEventHandler } from 'react';
import { Button } from 'design-system/button';
import { BiInfoCircle, BiPlusCircle } from 'react-icons/bi';
import { Input } from 'design-system/input';
import { useForm } from 'development-kit/use-form';
import type { API4MarkdownPayload } from 'api-4markdown-contracts';
import { Field } from 'design-system/field';
import { Hint } from 'design-system/hint';
import { context } from '@greenonsoftware/react-kit';
import { Textarea } from 'design-system/textarea';

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
  disabled: boolean;
  variant: 'ai' | 'manual';
  onBack(): void;
  onSubmit: OnSubmit;
};

const [FormProvider, useFormContext] = context(
  (props: NewDocumentFormProps) => props,
);

const ManualForm = () => {
  const ctx = useFormContext();

  const [{ invalid, values, untouched }, { inject }] =
    useForm<ManualFormValues>({ name: `` });

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
    </form>
  );
};

const AIForm = () => {
  const ctx = useFormContext();

  const [{ invalid, values, untouched }, { inject }] = useForm<AIFormValues>({
    name: `How to be productive as a software engineer`,
    description: `Complete guide to mastering productivity and quality in your daily work: Eisenhower Matrix and Awakened Day technique with a Feedback Loop`,
    style: `soft, edgy, smart`,
    structure: `# How To Be Productive As A Software Engineer
## Just Follow The Damn Yourself, CJ
## The Awakened Day Method
## Difference Between Strategic And Tactical Goals
## Don't Begin Until You Are Ready To Finish
## Mastering Eisenhower Matrix
## Neverending Fight With Context Switching
## Apps And Tools
## Struggling Against Distractions
## Learning With Passion
## Using All That We've Learned
## My Achievements In 2024
## Summary`,
    sample: `> The techniques I'm proposing here are my personal ones, based on consultations with professional therapists. You can try them, but I'm 100% sure they won't automatically fit your personal case. However, it's always good to broaden your horizons, and I recommend using others' experiences as inspiration to invent something tailored to your needs.  

# How To Be **Productive** As A **Software Engineer**  

I asked AI about types of people related to their work style, and this is what I got back:  

1. Ticket monkeys.  
2. Those who reflect on every piece of work they do.  

This difference is critical because true productivity comes from self-awareness (by understanding your work style). By analyzing how you work daily, you step outside your comfort zone and confront your current "self" with reality.`,
    profession: `Psychologist`,
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
            Generation will take <strong>5 tokens</strong>
          </p>
        </div>
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
      return <ManualForm />;
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
