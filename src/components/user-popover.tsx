import { Button } from 'design-system/button';
import React from 'react';
import { BiLogInCircle, BiUser } from 'react-icons/bi';
import { useAuthStore } from 'store/auth/auth.store';
import { signInOutActions } from 'store/sign-in-out/sign-in-out.actions';

const UserPopover = () => {
  const authStore = useAuthStore();

  const title =
    authStore.is === `authorized` ? `User details and options` : `Sign In`;
  const handleClick =
    authStore.is === `authorized` ? () => {} : signInOutActions.in;

  return (
    <Button
      i={2}
      disabled={authStore.is === `idle`}
      rfull
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
          {authStore.user.name ? authStore.user.name.charAt(0) : `U`}
        </span>
      )}
      {authStore.is === `idle` && <BiLogInCircle className="text-2xl" />}
      {authStore.is === `unauthorized` && <BiUser className="text-2xl" />}
    </Button>
  );
};

export default UserPopover;
