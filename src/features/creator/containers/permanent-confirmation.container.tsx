import { Button } from 'design-system/button';
import { useToggle } from 'development-kit/use-toggle';
import React, { type FormEventHandler } from 'react';
import { BiX } from 'react-icons/bi';
import { PermamentDocFormContainer } from './permament-doc-form.container';
import { Link } from 'gatsby';
import { meta } from '../../../../meta';
import { useDocumentsCreatorState } from 'store/documents-creator';

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
  const { busy } = useDocumentsCreatorState();
  const formSection = useToggle();

  const openFormSection: FormEventHandler<HTMLFormElement> = async (
    e,
  ): Promise<void> => {
    e.preventDefault();
    formSection.open();
  };

  if (formSection.opened) {
    return (
      <PermamentDocFormContainer
        onClose={onClose}
        onConfirm={onConfirm}
        onBack={formSection.close}
      />
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
          disabled={busy}
          title="Close document permanent status confirmation"
          onClick={onClose}
        >
          <BiX />
        </Button>
      </header>
      <p className="mt-4 mb-1">
        Changing the visibility to <strong>permanent</strong> will make your
        document available in <strong>Google</strong> and{` `}
        <Link
          className="underline underline-offset-2 text-blue-800 dark:text-blue-500 mt-1 font-bold"
          to={meta.routes.docs.educationZone}
        >
          Education Zone
        </Link>
        {` `}
        after several days.
      </p>
      <p>
        <i>
          The document status can be changed later, however removing it from
          {` `}
          <strong>Google</strong> and{` `}
          <Link
            className="underline underline-offset-2 text-blue-800 dark:text-blue-500 mt-1 font-bold"
            to={meta.routes.docs.educationZone}
          >
            Education Zone
          </Link>
          {` `}
          may take some time.
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
