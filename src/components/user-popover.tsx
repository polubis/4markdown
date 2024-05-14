import { Button } from 'design-system/button';
import React from 'react';
import { BiLogInCircle } from 'react-icons/bi';
import { useAuthStore } from 'store/auth/auth.store';
import { useToggle } from 'development-kit/use-toggle';
import { useDocsStore } from 'store/docs/docs.store';
import { YourAvatar } from './your-avatar';

const UserPopoverContent = React.lazy(() => import(`./user-popover-content`));

const UserPopover = () => {
  const menu = useToggle();
  const authStore = useAuthStore();
  const docsStore = useDocsStore();

  const handleClick = () => {
    if (authStore.is === `idle`) return;

    if (authStore.is === `authorized`) {
      menu.open();
      return;
    }

    authStore.logIn();
  };

  return (
    <>
      <Button
        i={1}
        s={2}
        disabled={authStore.is === `idle` || docsStore.is === `busy`}
        title={
          authStore.is === `authorized` ? `User details and options` : `Sign in`
        }
        onClick={handleClick}
      >
        {authStore.is === `authorized` && (
          <YourAvatar size="tn" h={24} w={24} />
        )}
        {(authStore.is === `idle` || authStore.is === `unauthorized`) && (
          <BiLogInCircle />
        )}
      </Button>
      {menu.opened && (
        <React.Suspense>
          <UserPopoverContent onClose={menu.close} />
        </React.Suspense>
      )}
    </>
  );
};

export default UserPopover;
