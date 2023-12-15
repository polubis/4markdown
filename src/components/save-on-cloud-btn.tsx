import React from 'react';
import { Button } from 'design-system/button';
import { BiSave } from 'react-icons/bi';
import { useAuthStore } from 'store/auth/auth.store';
import { signInOutActions } from 'store/sign-in-out/sign-in-out.actions';

const SaveOnCloudButton = () => {
  const authStore = useAuthStore();

  const handleClick =
    authStore.is === `authorized` ? () => {} : signInOutActions.in;

  return (
    <Button
      className="ml-2"
      i={2}
      rfull
      title="Save file on the cloud"
      onClick={handleClick}
    >
      <BiSave className="text-2xl" />
    </Button>
  );
};

export default SaveOnCloudButton;
