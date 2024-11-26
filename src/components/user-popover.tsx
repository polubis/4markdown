import { Button } from 'design-system/button';
import React from 'react';
import { BiLogInCircle } from 'react-icons/bi';
import { useAuthState } from 'store/auth';
import { useToggle } from 'development-kit/use-toggle';
import { YourAvatarContainer } from '../containers/your-avatar.container';
import { logInAct } from 'acts/log-in.act';
import { useDocumentsCreatorState } from 'store/documents-creator';
import { useYourUserProfileState } from 'store/your-user-profile';

const UserPopoverContent = React.lazy(() => import(`./user-popover-content`));

const UserPopover = () => {
  const menu = useToggle();
  const authStore = useAuthState();
  const documentsCreatorBusy = useDocumentsCreatorState((state) => state.busy);
  const yourUserProfileBusy = useYourUserProfileState((state) => state.busy);

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
          authStore.is === `idle` || documentsCreatorBusy || yourUserProfileBusy
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
