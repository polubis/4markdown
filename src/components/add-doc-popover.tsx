import { Button } from 'design-system/button';
import { useAuthListen } from 'development-kit/use-auth-listen';
import { useToggle } from 'development-kit/use-toggle';
import React from 'react';
import { BiPlus } from 'react-icons/bi';
import { useAuthStore } from 'store/auth/auth.store';
import { signInOutActions } from 'store/sign-in-out/sign-in-out.actions';

const AddDocPopoverContent = React.lazy(
  () => import(`./add-doc-popover-content`),
);

const SS_ADD_REQUESTED_KEY = `addRequested`;

const AddDocPopover: React.FC = () => {
  const authStore = useAuthStore();
  const menu = useToggle();

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = () => {
    if (authStore.is === `authorized`) {
      menu.open();
      return;
    }

    localStorage.setItem(SS_ADD_REQUESTED_KEY, `1`);
    signInOutActions.in();
  };

  useAuthListen(() => {
    const openRequested = !Number.isNaN(
      Number.parseInt(localStorage.getItem(SS_ADD_REQUESTED_KEY) ?? ``),
    );

    if (menu.closed && openRequested) {
      localStorage.removeItem(SS_ADD_REQUESTED_KEY);
      menu.open();
    }
  });

  return (
    <>
      <Button i={2} rfull title="Create new document" onClick={handleClick}>
        <BiPlus className="text-2xl" />
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
