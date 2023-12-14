import React from 'react';
import { Button } from 'design-system/button';
import { BiSave } from 'react-icons/bi';

/* {authStore.user.name && authStore.user.avatar && (
          <img
            referrerPolicy="no-referrer"
            className="h-[24px] w-[24px] rounded-full shadow-lg"
            src={authStore.user.avatar}
            alt={authStore.user.name}
          />
        )} */

const SaveOnCloudButton = () => {
  return (
    <Button className="ml-2" i={2} rfull title="Save file on the cloud">
      <BiSave className="text-2xl" />
    </Button>
  );
};

export default SaveOnCloudButton;
