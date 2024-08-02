import { makeDocPermamentSchema } from 'core/validators/doc-validators';
import { Button } from 'design-system/button';
import { Field } from 'design-system/field';
import { Hint } from 'design-system/hint';
import { Input } from 'design-system/input';
import { Textarea } from 'design-system/textarea';
import { useForm } from 'development-kit/use-form';
import React, { type FormEventHandler } from 'react';
import { BiX } from 'react-icons/bi';
import { authStoreSelectors } from 'store/auth/auth.store';
import { useDocManagementStore } from 'store/doc-management/doc-management.store';
import { docStoreSelectors } from 'store/doc/doc.store';
import { SeoFriendlyDescriptionHint } from '../components/seo-friendly-description-hint';

interface PermamentDocFormContainerProps {
  onConfirm(): void;
  onClose(): void;
  onBack(): void;
}

const PermamentDocFormContainer = ({
  onConfirm,
  onClose,
  onBack,
}: PermamentDocFormContainerProps) => {
  const docStore = docStoreSelectors.active();
  const docManagementStore = useDocManagementStore();
  const [{ invalid, values, result, untouched }, { inject }] = useForm(
    {
      name: docStore.name,
      description:
        docStore.visibility === `permanent` ? docStore.description : ``,
      tags: docStore.visibility === `permanent` ? docStore.tags.join(`,`) : ``,
    },
    makeDocPermamentSchema,
  );

  const { name, description, tags } = values;

  const handleConfirm: FormEventHandler<HTMLFormElement> = async (
    e,
  ): Promise<void> => {
    e.preventDefault();

    try {
      await authStoreSelectors
        .authorized()
        .makeDocPermanent(name, description, tags.split(`,`));
      onConfirm();
    } catch {}
  };

  return (
    <form className="flex flex-col" onSubmit={handleConfirm}>
      <header className="flex items-center mb-4">
        <h6 className="text-xl mr-4">Add Required Data</h6>
        <Button
          i={2}
          s={1}
          className="ml-auto"
          disabled={docManagementStore.is === `busy`}
          title="Close document permanent status change"
          onClick={onClose}
        >
          <BiX />
        </Button>
      </header>
      <Field label={`Name (${name.length})*`} className="mt-2">
        <Input autoFocus placeholder="Type document name" {...inject(`name`)} />
      </Field>
      <Field
        label={`Description (${description.length})*`}
        className="mt-3"
        hint={<SeoFriendlyDescriptionHint />}
      >
        <Textarea
          placeholder="Describe your document in 3-4 sentences. The description will be displayed in Google"
          {...inject(`description`)}
        />
      </Field>
      <Field
        label={result.tags ? `Tags*` : `Tags (${tags.split(`,`).length})*`}
        className="mt-2"
        hint={<Hint trigger="It may be React, Angular, Vue and others..." />}
      >
        <Input placeholder="Separate tags with a comma" {...inject(`tags`)} />
      </Field>
      <footer className="mt-6 flex">
        <Button
          className="ml-auto"
          type="button"
          i={1}
          s={2}
          auto
          title="Back to document status confirmation"
          disabled={docManagementStore.is === `busy`}
          onClick={onBack}
        >
          Back
        </Button>
        <Button
          type="submit"
          className="ml-2"
          i={2}
          s={2}
          auto
          disabled={invalid || untouched || docManagementStore.is === `busy`}
          title="Make document permanent"
        >
          Confirm
        </Button>
      </footer>
    </form>
  );
};

export { PermamentDocFormContainer };
