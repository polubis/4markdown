/* {authStore.user.name && authStore.user.avatar && (
          <img
            referrerPolicy="no-referrer"
            className="h-[24px] w-[24px] rounded-full shadow-lg"
            src={authStore.user.avatar}
            alt={authStore.user.name}
          />
        )} */

import { Button } from 'design-system/button';
import React from 'react';
import { BiUser } from 'react-icons/bi';
import { useAuthStore } from 'store/auth/auth.store';

const UserPopover = () => {
  const authStore = useAuthStore();

  const title =
    authStore.is === `authorized` ? `User details and options` : `Sign In`;

  return (
    <Button i={2} rfull title={title}>
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
      {(authStore.is === `idle` || authStore.is === `unauthorized`) && (
        <BiUser className="text-2xl" />
      )}
    </Button>
  );
};

export default UserPopover;
