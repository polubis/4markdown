import { Button } from 'design-system/button';
import { Field } from 'design-system/field';
import { Input } from 'design-system/input';
import { Textarea } from 'design-system/textarea';
import { useToggle } from 'development-kit/use-toggle';
import React from 'react';
import { BiX } from 'react-icons/bi';
import { authStoreSelectors } from 'store/auth/auth.store';
import { useDocManagementStore } from 'store/doc-management/doc-management.store';
import { docStoreSelectors, docStoreValidators } from 'store/doc/doc.store';

interface PermanentConfirmationContainerProps {
  onConfirm(): void;
  onCancel(): void;
  onClose(): void;
}

const PermanentConfirmationContainer = ({
  onConfirm,
  onCancel,
  onClose,
}: PermanentConfirmationContainerProps) => {
  const docStore = docStoreSelectors.active();
  const docManagementStore = useDocManagementStore();
  const formSection = useToggle();
  const [name, setName] = React.useState(docStore.name);
  const [description, setDescription] = React.useState(
    docStore.visibility === `permanent` ? docStore.description : ``,
  );
  const [tags, setTags] = React.useState(
    docStore.visibility === `permanent` ? docStore.tags.join(`,`) : ``,
  );

  const openFormSection: React.FormEventHandler<HTMLFormElement> = async (
    e,
  ): Promise<void> => {
    e.preventDefault();
    formSection.open();
  };

  const handleConfirm: React.FormEventHandler<HTMLFormElement> = async (
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

  const nameInvalid = !docStoreValidators.name(name);
  const descriptionInvalid = !docStoreValidators.description(description);
  const tagsInvalid = !docStoreValidators.tags(tags);

  if (formSection.opened) {
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
          <Input
            autoFocus
            placeholder="Type document name"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </Field>
        <Field label={`Description (${description.length})*`} className="mt-3">
          <Textarea
            placeholder="Describe your document in 3-4 sentences. The description will be displayed in Google"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />
        </Field>
        <Field
          label={tagsInvalid ? `Tags*` : `Tags (${tags.split(`,`).length})*`}
          className="mt-2"
          hint="It may be React, Angular, Vue and others..."
        >
          <Input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Separate tags with a comma"
          />
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
            onClick={formSection.close}
          >
            Back
          </Button>
          <Button
            type="submit"
            className="ml-2"
            i={2}
            s={2}
            auto
            disabled={
              docManagementStore.is === `busy` ||
              nameInvalid ||
              descriptionInvalid ||
              tagsInvalid
            }
            title="Make document permanent"
          >
            Submit
          </Button>
        </footer>
      </form>
    );
  }

  return (
    <form className="flex flex-col" onSubmit={openFormSection}>
      <header className="flex items-center">
        <h6 className="text-xl mr-4 capitalize">Make it permanent</h6>
        <Button
          i={2}
          s={1}
          className="ml-auto"
          disabled={docManagementStore.is === `busy`}
          title="Close document permanent status confirmation"
          onClick={onClose}
        >
          <BiX />
        </Button>
      </header>
      <p className="mt-4 mb-1">
        Changing the visibility to <strong>permanent</strong> will make your
        document available in a <strong>static URL</strong>.
      </p>
      <p>
        The document will be available in <strong>Google</strong> after several
        days. Make sure that you don&apos;t have any sensitive data in this
        document.
      </p>
      <p className="mt-1">
        <i>
          The document status can be changed later, however removing it from
          {` `}
          <strong>Google</strong> may take several days.
        </i>
      </p>
      <footer className="mt-6 flex">
        <Button
          className="ml-auto"
          type="button"
          i={1}
          s={2}
          auto
          title="Cancel document permanent status confirmation"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="ml-2"
          i={2}
          s={2}
          auto
          title="Confirm permanent document policy"
        >
          Confirm
        </Button>
      </footer>
    </form>
  );
};

export { PermanentConfirmationContainer };
