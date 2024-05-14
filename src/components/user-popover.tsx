import { Button } from 'design-system/button';
import React from 'react';
import { BiLogInCircle, BiQuestionMark } from 'react-icons/bi';
import { useAuthStore } from 'store/auth/auth.store';
import { useToggle } from 'development-kit/use-toggle';
import { useDocsStore } from 'store/docs/docs.store';
import { yourProfileStoreSelectors } from 'store/your-profile/your-profile.store';

const UserPopoverContent = React.lazy(() => import(`./user-popover-content`));

const UserPopover = () => {
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
        s={2}
        disabled={authStore.is === `idle` || docsStore.is === `busy`}
        title={
          authStore.is === `authorized` ? `User details and options` : `Sign in`
        }
        onClick={handleClick}
      >
        {authStore.is === `authorized` && yourProfileStore.is === `ok` && (
          <>
            {yourProfileStore.user?.avatar ? (
              <img
                referrerPolicy="no-referrer"
                className="h-[24px] w-[24px] rounded-full shadow-lg"
                src={yourProfileStore.user.avatar.tn.src}
                alt="Your avatar"
              />
            ) : (
              <span className="text-xl capitalize">
                {yourProfileStore.user?.displayName ? (
                  yourProfileStore.user?.displayName.charAt(0)
                ) : (
                  <BiQuestionMark size={24} />
                )}
              </span>
            )}
          </>
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
