import type { API4MarkdownPayload } from 'api-4markdown-contracts';
import { AppNavigation } from 'components/app-navigation';
import { AppFooterContainer } from 'containers/app-footer.container';
import { CreationLinkContainer } from 'containers/creation-link.container';
import { DocsBrowseLinkContainer } from 'containers/docs-browse-link.container';
import { Button } from 'design-system/button';
import { Field } from 'design-system/field';
import { Input } from 'design-system/input';
import { Textarea } from 'design-system/textarea';
import {
  maxLength,
  minLength,
  noEdgeSpaces,
  optional,
  name,
} from 'development-kit/form';
import { useForm } from 'development-kit/use-form';
import { SeoFriendlyDescriptionHint } from 'features/creator/components/seo-friendly-description-hint';
import { Link } from 'gatsby';
import React, { type FormEventHandler } from 'react';
import {
  BiArrowBack,
  BiArrowFromLeft,
  BiSolidArrowToLeft,
} from 'react-icons/bi';
import { meta } from '../../../meta';
import { Hint } from 'design-system/hint';

const CreateMindmapView = () => {
  const [{ invalid, values, result, untouched }, { inject }] = useForm<
    API4MarkdownPayload<'createMindmap'>
  >(
    {
      name: ``,
      description: ``,
    },
    {
      name: [noEdgeSpaces, minLength(2), maxLength(100), name],
      description: [optional(noEdgeSpaces, maxLength(400))],
    },
  );

  const handleConfirm: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <AppNavigation>
        <CreationLinkContainer />
        <DocsBrowseLinkContainer />
      </AppNavigation>
      <main>
        <section className="min-h-screen flex">
          <form
            className="flex flex-col border-r-2 border-zinc-300 dark:border-zinc-800 p-6 py-10 w-full max-w-[420px] flex-shrink-0"
            onSubmit={handleConfirm}
          >
            <h1 className="text-2xl mb-2">Create Mindmap</h1>
            <p className="mb-4">
              By default, the mindmap will be created in{` `}
              <strong>private mode</strong>, meaning only you will be able to
              view it. You can change this at any time later
            </p>
            <Field label={`Name (${values.name.length})*`} className="mt-2">
              <Input
                autoFocus
                placeholder="Type mindmap name"
                {...inject(`name`)}
              />
            </Field>
            <Field
              label={`Description (${values.description.length})`}
              className="mt-3"
            >
              <Textarea
                placeholder="Describe your mindmap in 3-4 sentences"
                {...inject(`description`)}
              />
            </Field>
            <footer className="mt-6 flex">
              <Link className="ml-auto" to={meta.routes.home}>
                <Button type="button" i={1} s={2} auto>
                  <BiArrowBack /> Back
                </Button>
              </Link>
              <Button
                disabled={invalid}
                type="submit"
                className="ml-2"
                i={2}
                s={2}
                auto
              >
                Confirm
              </Button>
            </footer>
          </form>
          <div className="w-full">siema</div>
        </section>
      </main>
      <AppFooterContainer />
    </>
  );
};

export { CreateMindmapView };
