import { Button } from 'design-system/button';
import { useToggle } from 'development-kit/use-toggle';
import React from 'react';
import { BiPlus } from 'react-icons/bi';
import { useAuthStore } from 'store/auth/auth.store';
import {
  creatorStoreActions,
  creatorStoreSelectors,
} from 'store/creator/creator.store';
import { useDocManagementStore } from 'store/doc-management/doc-management.store';

const AddDocPopoverContent = React.lazy(
  () => import(`./add-doc-popover-content`),
);

const AddDocPopover: React.FC = () => {
  const docManagementStore = useDocManagementStore();
  const authStore = useAuthStore();
  const menu = useToggle();

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = () => {
    if (authStore.is === `idle`) return;

    if (authStore.is === `authorized`) {
      menu.open();
      return;
    }

    creatorStoreActions.triggerCreation();
    authStore.logIn();
  };

  React.useEffect(() => {
    if (authStore.is !== `authorized` || menu.opened) return;

    if (!creatorStoreSelectors.isDocumentCreationActive()) return;

    creatorStoreActions.resetCreation();
    menu.open();
  }, [authStore.is, menu]);

  React.useEffect(() => {
    if (docManagementStore.is === `fail`) {
      menu.close();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docManagementStore]);

  return (
    <>
      <Button i={1} s={2} title="Create new document" onClick={handleClick}>
        <BiPlus />
      </Button>
      {menu.opened && (
        <React.Suspense>
          <AddDocPopoverContent onClose={menu.close} />
        </React.Suspense>
      )}
    </>
  );
};

export default AddDocPopover;
