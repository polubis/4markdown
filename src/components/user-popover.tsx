import { Button } from 'design-system/button';
import React from 'react';
import { BiLogInCircle } from 'react-icons/bi';
import { useAuthStore } from 'store/auth/auth.store';
import { useDocsStore } from 'store/docs/docs.store';
import { YourAvatarContainer } from '../containers/your-avatar.container';
import { yourProfileStoreSelectors } from 'store/your-profile/your-profile.store';
import { logIn } from 'actions/log-in.action';
import { useSimpleFeature } from 'development-kit/use-simple-feature';

const UserPopoverContent = React.lazy(() => import(`./user-popover-content`));

const UserPopover = ({ className }: { className?: string }) => {
  const menu = useSimpleFeature();
  const authStore = useAuthStore();
  const docsStore = useDocsStore();
  const yourProfileStore = yourProfileStoreSelectors.useState();

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
      {menu.is === `on` && (
        <React.Suspense>
          <UserPopoverContent onClose={menu.off} />
        </React.Suspense>
      )}
    </>
  );
};

export default UserPopover;
