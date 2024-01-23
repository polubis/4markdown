import { Button } from 'design-system/button';
import React, { useState, useEffect } from 'react';
import { BiLogInCircle, BiQuestionMark } from 'react-icons/bi';
import { useAuthStore } from 'store/auth/auth.store';
import { useToggle } from 'development-kit/use-toggle';
import { useDocsStore } from 'store/docs/docs.store';
import Loader from './loader';

const UserPopoverContent = React.lazy(() => import(`./user-popover-content`));

const UserPopover = () => {
  const [loading, setLoading] = useState(false);
  const menu = useToggle();
  const authStore = useAuthStore();
  const docsStore = useDocsStore();

  const title =
    authStore.is === `authorized` ? `User details and options` : `Sign in`;

  useEffect(() => {
    setLoading(authStore.is === `idle`);
  }, [authStore.is]);

  const handleClick = async () => {
    if (authStore.is === `idle`) return;

    if (authStore.is === `authorized`) {
      menu.open();
      return;
    }

    setLoading(true);

    try {
      await authStore.logIn();
    } catch (error) {
      console.error(`Błąd podczas logowania:`, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <Button
        i={1}
        s={2}
        disabled={authStore.is === `idle` || docsStore.is === `busy`}
        title={title}
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
      {menu.opened && (
        <React.Suspense>
          <UserPopoverContent onClose={menu.close} />
        </React.Suspense>
      )}
    </>
  );
};

export default UserPopover;
