import {
  isDocumentCreationActive,
  resetDocumentCreation,
  triggerDocumentCreation,
} from 'core/creation-management';
import { Button } from 'design-system/button';
import React from 'react';
import { BiPlus } from 'react-icons/bi';
import { useAuthStore } from 'store/auth/auth.store';
import { logIn } from 'actions/log-in.action';
import { useDocManagementStore } from 'store/doc-management/doc-management.store';
import { useSimpleFeature } from '@greenonsoftware/react-kit';

const CreateDocumentModalContainer = React.lazy(() =>
  import(`../containers/create-document-modal.container`).then((m) => ({
    default: m.CreateDocumentModalContainer,
  })),
);

const AddDocPopover = () => {
  const docManagementStore = useDocManagementStore();
  const authStore = useAuthStore();
  const menu = useSimpleFeature();

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = () => {
    if (authStore.is === `idle`) return;

    if (authStore.is === `authorized`) {
      menu.on();
      return;
    }

    triggerDocumentCreation();
    logIn();
  };

  React.useEffect(() => {
    if (authStore.is !== `authorized` || menu.isOn) return;

    if (!isDocumentCreationActive()) return;

    resetDocumentCreation();

    menu.on();
  }, [authStore.is, menu]);

  React.useEffect(() => {
    if (docManagementStore.is === `fail`) {
      menu.off();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docManagementStore]);

  return (
    <>
      <Button i={1} s={2} title="Create new document" onClick={handleClick}>
        <BiPlus />
      </Button>
      {menu.isOn && (
        <React.Suspense>
          <CreateDocumentModalContainer onClose={menu.off} />
        </React.Suspense>
      )}
    </>
  );
};

export default AddDocPopover;
