import React from 'react';
import { Button } from 'design-system/button';
import { BiX } from 'react-icons/bi';
import { useConfirm } from 'development-kit/use-confirm';
import Popover from 'design-system/popover';
import { useAuthStore } from 'store/auth/auth.store';

interface UserPopoverContentProps {
  onClose(): void;
}

const UserPopoverContent: React.FC<UserPopoverContentProps> = ({ onClose }) => {
  const authStore = useAuthStore();

  const signOutConfirmation = useConfirm(async () => {
    if (authStore.is === `authorized`) {
      authStore.logOut();
    }
    onClose();
  });

  return (
    <>
      <Popover
        className="bottom-20 right-2 md:bottom-auto md:top-16"
        onBackdropClick={onClose}
      >
        <div className="max-w-[280px] flex flex-col">
          <div className="flex items-center">
            <h6 className="text-xl">Your Account</h6>
            <Button i={2} rfull className="ml-8" onClick={onClose}>
              <BiX className="text-2xl" />
            </Button>
          </div>
          <Button
            overlay={signOutConfirmation.opened ? `Sure?` : undefined}
            className="mt-20 ml-auto"
            i={2}
            rfull
            onClick={signOutConfirmation.confirm}
          >
            Sign Out
          </Button>
        </div>
      </Popover>
    </>
  );
};

export default UserPopoverContent;
