import { Button } from 'design-system/button';
import React from 'react';
import { BiLogInCircle } from 'react-icons/bi';
import { useAuthState } from 'store/auth';
import { useToggle } from 'development-kit/use-toggle';
import { YourAvatarContainer } from '../containers/your-avatar.container';
import { yourProfileStoreSelectors } from 'store/your-profile/your-profile.store';
import { logInAct } from 'acts/log-in.act';
import { useDocumentsCreatorState } from 'store/documents-creator';

const UserPopoverContent = React.lazy(() => import(`./user-popover-content`));

const UserPopover = () => {
  const menu = useToggle();
  const authStore = useAuthState();
  const { busy } = useDocumentsCreatorState();
  const yourProfileStore = yourProfileStoreSelectors.useState();

  const handleClick = () => {
    if (authStore.is === `idle`) return;

    if (authStore.is === `authorized`) {
      menu.open();
      return;
    }

    logInAct();
  };

  return (
    <>
      <Button
        i={1}
        s={2}
        disabled={
          authStore.is === `idle` || busy || yourProfileStore.is === `busy`
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
