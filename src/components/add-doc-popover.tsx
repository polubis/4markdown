import { Button } from 'design-system/button';
import { useToggle } from 'development-kit/use-toggle';
import React from 'react';
import { BiPlus } from 'react-icons/bi';
import { useAuthStore } from 'store/auth/auth.store';
import { useDocManagementStore } from 'store/doc-management/doc-management.store';

const AddDocPopoverContent = React.lazy(
  () => import(`./add-doc-popover-content`),
);

const SS_ADD_REQUESTED_KEY = `addRequested`;

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

    localStorage.setItem(SS_ADD_REQUESTED_KEY, `1`);
    authStore.logIn();
  };

  React.useEffect(() => {
    const openRequested = !Number.isNaN(
      Number.parseInt(localStorage.getItem(SS_ADD_REQUESTED_KEY) ?? ``),
    );

    if (openRequested) {
      localStorage.removeItem(SS_ADD_REQUESTED_KEY);
      menu.open();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
