import { createMindmapAct } from 'acts/create-mindmap.act';
import { type API4MarkdownPayload } from 'api-4markdown-contracts';
import { AppNavigation } from 'components/app-navigation';
import { AppFooterContainer } from 'containers/app-footer.container';
import { CreationLinkContainer } from 'containers/creation-link.container';
import { EducationRankLinkContainer } from 'containers/education-rank-link.container';
import { EducationZoneLinkContainer } from 'containers/education-zone-link.container';
import { Button } from 'design-system/button';
import { Field } from 'design-system/field';
import { Hint } from 'design-system/hint';
import { Input } from 'design-system/input';
import { Textarea } from 'design-system/textarea';
import { maxLength, minLength, optional } from 'development-kit/form';
import { useForm } from 'development-kit/use-form';
import { type Transaction } from 'development-kit/utility-types';
import React, { type FormEventHandler } from 'react';
import { BiErrorAlt, BiPlusCircle } from 'react-icons/bi';

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

const NewMindmapView = () => {
  const [operation, setOperation] = React.useState<Transaction>({ is: `idle` });

  const [{ values, untouched, invalid }, { inject }] = useForm<
    API4MarkdownPayload<`createMindmap`>
  >(
    {
      name: ``,
      description: ``,
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
    setOperation({ is: `busy` });
    setOperation(await createMindmapAct(values));
  };

  return (
    <>
      <AppNavigation>
        <CreationLinkContainer />
        <EducationRankLinkContainer />
        <EducationZoneLinkContainer />
      </AppNavigation>
      <main className="p-4 min-h-svh flex flex-col justify-center">
        <section className="w-full md:w-[360px] mx-auto rounded-md border-zinc-300 dark:border-zinc-800 border p-4">
          <h2 className="text-xl mb-4">Create Mindmap</h2>
          <form className="flex flex-col gap-3" onSubmit={confirmCreation}>
            <Field label="Name*">
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
                      Mindmap will be created in <strong>private mode</strong>.
                      Visible only to you, but data inside is{` `}
                      <strong>not encrypted</strong> -{` `}
                      <strong>avoid sensitive data</strong>
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
            <footer className="mt-6">
              {operation.is === `fail` && (
                <p className="flex gap-2 text-sm justify-center mb-4 items-center bg-red-200 dark:bg-red-700 p-2 rounded-md">
                  <BiErrorAlt className="shrink-0" size={20} />
                  {operation.error.message}
                </p>
              )}
              <Button
                type="submit"
                i={2}
                s={2}
                className="w-full"
                auto
                title="Confirm mindmap creation"
                disabled={operation.is === `busy` || untouched || invalid}
              >
                Create
                <BiPlusCircle />
              </Button>
            </footer>
          </form>
        </section>
      </main>
      <AppFooterContainer />
    </>
  );
};

export { NewMindmapView };
