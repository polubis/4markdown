import React from 'react';
import { Button, type ButtonProps } from 'design-system/button';
import { useAuthStore } from 'store/auth/auth.store';
import { BiSave } from 'react-icons/bi';
import { useConfirm } from 'development-kit/use-confirm';

const baseProps: ButtonProps = {
  className: `ml-2 flex w-[88px]`,
  i: 2,
  rfull: true,
  title: `Save file on the cloud`,
};

const SaveOnCloudButton = () => {
  const authStore = useAuthStore();
  const confirmation = useConfirm(() => {});

  const Icon = <BiSave className="text-2xl ml-2 shrink-0" />;

  if (authStore.is === `authorized`) {
    return (
      <Button
        {...baseProps}
        overlay={confirmation.opened ? `Saved` : undefined}
        onClick={confirmation.confirm}
      >
        {authStore.user.name && authStore.user.avatar && (
          <img
            referrerPolicy="no-referrer"
            className="h-[24px] w-[24px] rounded-full shadow-lg"
            src={authStore.user.avatar}
            alt={authStore.user.name}
          />
        )}
        {Icon}
      </Button>
    );
  }

  return (
    <Button {...baseProps}>
      <div className="h-[24px] w-[24px] bg-gray-400 rounded-full shadow-lg" />
      {Icon}
    </Button>
  );
};

export default SaveOnCloudButton;
