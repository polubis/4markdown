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
import { useForm } from 'development-kit/use-form';
import React from 'react';
import { BiPlusCircle } from 'react-icons/bi';

const NewMindmapView = () => {
  const [, { inject }] = useForm({
    name: ``,
    description: ``,
  });

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
          <form className="flex flex-col gap-3">
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
              <Button
                type="submit"
                i={2}
                s={2}
                className="w-full"
                auto
                title="Confirm mindmap creation"
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
