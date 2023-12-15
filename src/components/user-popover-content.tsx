import Backdrop from 'design-system/backdrop';
import React from 'react';
import c from 'classnames';
import { Button } from 'design-system/button';
import { BiX } from 'react-icons/bi';
import { useConfirm } from 'development-kit/use-confirm';
import { signInOutActions } from 'store/sign-in-out/sign-in-out.actions';

const baseClasses = `fixed rounded-md bg-zinc-200 dark:bg-gray-950 shadow-lg z-30`;

interface UserPopoverContentProps {
  onClose(): void;
}

const UserPopoverContent: React.FC<UserPopoverContentProps> = ({ onClose }) => {
  const signOutConfirmation = useConfirm(() => {
    signInOutActions.out();
    onClose();
  });

  const Content = (
    <div className="max-w-[280px] flex flex-col p-4">
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
  );

  return (
    <>
      <div className={c(baseClasses, `hidden md:flex right-4 top-16`)}>
        {Content}
      </div>
      <div
        className={c(
          baseClasses,
          `flex md:hidden right-4 bottom-16 max-w-max overflow-y-auto`,
        )}
      >
        {Content}
      </div>
      <Backdrop onClick={onClose} />
    </>
  );
};

export default UserPopoverContent;
