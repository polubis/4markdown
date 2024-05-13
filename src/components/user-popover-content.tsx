import React from 'react';
import { Button } from 'design-system/button';
import { BiEdit, BiX } from 'react-icons/bi';
import { useConfirm } from 'development-kit/use-confirm';
import Popover from 'design-system/popover';
import { useAuthStore } from 'store/auth/auth.store';
import { useDocsStore } from 'store/docs/docs.store';
import {
  userProfileStoreActions,
  userProfileStoreSelectors,
} from 'store/your-profile/your-profile.store';
import { Loader } from 'design-system/loader';
import ErrorModal from './error-modal';

interface UserPopoverContentProps {
  className: string;
  onClose(): void;
}

const UserPopoverContent: React.FC<UserPopoverContentProps> = ({
  className,
  onClose,
}) => {
  const authStore = useAuthStore();
  const docsStore = useDocsStore();
  const userProfileStore = userProfileStoreSelectors.useState();

  const close = (): void => {
    if (userProfileStore.is === `busy`) return;

    onClose();
  };

  const signOutConfirmation = useConfirm(async () => {
    if (authStore.is === `authorized`) {
      authStore.logOut();
    }
    close();
  });

  if (userProfileStore.is === `fail`) {
    return (
      <ErrorModal
        heading="Ups, something went wrong"
        message={userProfileStore.error}
        onClose={userProfileStoreActions.idle}
      />
    );
  }

  return (
    <Popover className={className} onBackdropClick={close}>
      {(userProfileStore.is === `idle` || userProfileStore.is === `busy`) && (
        <Loader />
      )}
      {userProfileStore.is === `ok` && (
        <div className="max-w-[280px] flex flex-col">
          <div className="flex items-center">
            <h6 className="text-xl">Your Account</h6>
            <Button
              i={2}
              s={1}
              className="ml-8"
              title="Open user profile settings"
              // onClick={onSettingsOpen}
            >
              <BiEdit />
            </Button>
            <Button
              i={2}
              s={1}
              className="ml-2"
              title="Close your account panel"
              onClick={close}
            >
              <BiX />
            </Button>
          </div>
          {docsStore.is === `ok` && docsStore.docs.length > 0 && (
            <p className="mt-4 text-md font-bold">
              Documents: {docsStore.docs.length}
            </p>
          )}
          <Button
            className="mt-20 ml-auto"
            i={2}
            s={2}
            title="Sign out"
            auto
            onClick={signOutConfirmation.confirm}
          >
            {signOutConfirmation.opened ? `Are You Sure?` : `Sign Out`}
          </Button>
        </div>
      )}
    </Popover>
  );
};

export default UserPopoverContent;
