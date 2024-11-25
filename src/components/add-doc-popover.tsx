import {
  isDocumentCreationActive,
  resetDocumentCreation,
  triggerDocumentCreation,
} from 'core/creation-management';
import { Button } from 'design-system/button';
import { useToggle } from 'development-kit/use-toggle';
import React from 'react';
import { BiPlus } from 'react-icons/bi';
import { useAuthStore } from 'store/auth/auth.store';
import { logIn } from 'actions/log-in.action';
import { useDocumentsCreatorState } from 'store/documents-creator/documents-creator.store';

const CreateDocumentModal = React.lazy(() =>
  import(`./create-document-modal`).then((m) => ({
    default: m.CreateDocumentModal,
  })),
);

const AddDocPopover = () => {
  const { error } = useDocumentsCreatorState();
  const authStore = useAuthStore();
  const menu = useToggle();

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = () => {
    if (authStore.is === `idle`) return;

    if (authStore.is === `authorized`) {
      menu.open();
      return;
    }

    triggerDocumentCreation();
    logIn();
  };

  React.useEffect(() => {
    if (authStore.is !== `authorized` || menu.opened) return;

    if (!isDocumentCreationActive()) return;

    resetDocumentCreation();
    menu.open();
  }, [authStore.is, menu]);

  React.useEffect(() => {
    error && menu.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return (
    <>
      <Button i={1} s={2} title="Create new document" onClick={handleClick}>
        <BiPlus />
      </Button>
      {menu.opened && (
        <React.Suspense>
          <CreateDocumentModal onClose={menu.close} />
        </React.Suspense>
      )}
    </>
  );
};

export default AddDocPopover;
