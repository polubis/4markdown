import { Button } from 'design-system/button';
import React from 'react';
import { BiLogInCircle } from 'react-icons/bi';
import { useAuthStore } from 'store/auth/auth.store';
import { useDocsStore } from 'store/docs/docs.store';
import { YourAvatarContainer } from '../containers/your-avatar.container';
import { logIn } from 'actions/log-in.action';
import { useSimpleFeature } from '@greenonsoftware/react-kit';
import { useYourUserProfileState } from 'store/your-user-profile';

const UserPopoverContent = React.lazy(() => import(`./user-popover-content`));

const UserPopover = ({ className }: { className?: string }) => {
  const menu = useSimpleFeature();
  const authStore = useAuthStore();
  const docsStore = useDocsStore();
  const yourUserProfile = useYourUserProfileState();

  const handleClick = () => {
    if (authStore.is === `idle`) return;

    if (authStore.is === `authorized`) {
      menu.on();
      return;
    }

    logIn();
  };

  return (
    <>
      <Button
        i={1}
        s={2}
        className={className}
        disabled={
          authStore.is === `idle` ||
          docsStore.is === `busy` ||
          yourUserProfile.is === `busy`
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
      {menu.isOn && (
        <React.Suspense>
          <UserPopoverContent onClose={menu.off} />
        </React.Suspense>
      )}
    </>
  );
};

export default UserPopover;
