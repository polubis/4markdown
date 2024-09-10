import { Button } from 'design-system/button';
import React from 'react';
import { BiLogInCircle } from 'react-icons/bi';
import { useAuthStore } from 'store/auth/auth.store';
import { useToggle } from 'development-kit/use-toggle';
import { useDocsStore } from 'store/docs/docs.store';
import { YourAvatarContainer } from '../containers/your-avatar.container';
import { yourProfileStoreSelectors } from 'store/your-profile/your-profile.store';

const UserPopoverContent = React.lazy(() => import(`./user-popover-content`));

type UserPopoverProps = {
  className?: string;
};

const UserPopover = ({ className }: UserPopoverProps) => {
  const menu = useToggle();
  const authStore = useAuthStore();
  const docsStore = useDocsStore();
  const yourProfileStore = yourProfileStoreSelectors.useState();

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
        className={className}
        s={2}
        disabled={
          authStore.is === `idle` ||
          docsStore.is === `busy` ||
          yourProfileStore.is === `busy`
        }
        title={
          authStore.is === `authorized` ? `User details and options` : `Sign in`
        }
        onClick={handleClick}
      >
        {authStore.is === `authorized` && <YourAvatarContainer size="tn" />}
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
