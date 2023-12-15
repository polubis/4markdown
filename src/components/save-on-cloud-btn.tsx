import React, { useEffect } from 'react';
import { Button } from 'design-system/button';
import { BiSave } from 'react-icons/bi';
import { useAuthStore } from 'store/auth/auth.store';
import { signInOutActions } from 'store/sign-in-out/sign-in-out.actions';
import { docsStoreActions, useDocsStore } from 'store/docs/docs.store';

const SaveOnCloudButton = () => {
  const docsStore = useDocsStore();
  const authStore = useAuthStore();

  const handleClick = (): void => {
    if (authStore.is === `authorized`) {
      return;
    }

    docsStoreActions.init();
    signInOutActions.in();
  };

  if (
    authStore.is === `authorized` &&
    docsStore.is === `create-after-sign-in`
  ) {
    docsStoreActions.init();
  }

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
