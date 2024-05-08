import { Button } from 'design-system/button';
import React from 'react';
import { BiLogInCircle, BiQuestionMark } from 'react-icons/bi';
import { useAuthStore } from 'store/auth/auth.store';
import { useToggle } from 'development-kit/use-toggle';
import { useDocsStore } from 'store/docs/docs.store';

const UserPopoverContent = React.lazy(
  () => import(`../components/user-popover-content`),
);
const UserProfileFormModalContainer = React.lazy(
  () => import(`./user-profile-form-modal.container`),
);

interface UserPopoverContainerProps {
  className: string;
}

const UserPopoverContainer = ({ className }: UserPopoverContainerProps) => {
  const userContent = useToggle();
  const userDetailsSettingsModal = useToggle();
  const authStore = useAuthStore();
  const docsStore = useDocsStore();

  const handleClick = () => {
    if (authStore.is === `idle`) return;

    if (authStore.is === `authorized`) {
      userContent.open();
      return;
    }

    authStore.logIn();
  };

  const openUserDetailsSettings = (): void => {
    userContent.close();
    userDetailsSettingsModal.open();
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
        {authStore.is === `authorized` &&
          authStore.user.name &&
          authStore.user.avatar && (
            <img
              referrerPolicy="no-referrer"
              className="h-[24px] w-[24px] rounded-full shadow-lg"
              src={authStore.user.avatar}
              alt={authStore.user.name}
            />
          )}
        {authStore.is === `authorized` && !authStore.user.avatar && (
          <span className="text-2xl">
            {authStore.user.name ? (
              authStore.user.name.charAt(0)
            ) : (
              <BiQuestionMark />
            )}
          </span>
        )}
        {(authStore.is === `idle` || authStore.is === `unauthorized`) && (
          <BiLogInCircle />
        )}
      </Button>
      {userContent.opened && (
        <React.Suspense>
          <UserPopoverContent
            className={className}
            onClose={userContent.close}
            onSettingsOpen={openUserDetailsSettings}
          />
        </React.Suspense>
      )}
      {userDetailsSettingsModal.opened && (
        <React.Suspense>
          <UserProfileFormModalContainer onClose={userDetailsSettingsModal.close} />
        </React.Suspense>
      )}
    </>
  );
};

export default UserPopoverContainer;
