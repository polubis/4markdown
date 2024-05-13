import React from 'react';
import { Button } from 'design-system/button';
import { BiEdit, BiX } from 'react-icons/bi';
import { useConfirm } from 'development-kit/use-confirm';
import { authStoreSelectors } from 'store/auth/auth.store';
import { useDocsStore } from 'store/docs/docs.store';
import { userProfileStoreSelectors } from 'store/your-profile/your-profile.store';
import Modal from 'design-system/modal';

interface UserPopoverContentProps {
  onClose(): void;
}

const Detail = ({
  label,
  value,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
}) => (
  <p>
    {label}: <strong>{value}</strong>
  </p>
);

const DetailLoader = () => (
  <div className="flex space-x-1 h-6">
    <div className="rounded-md bg-gray-300 dark:bg-gray-800 h-full w-10" />
    <div className="rounded-md bg-gray-300 dark:bg-gray-800 h-full w-10" />
  </div>
);

const UserPopoverContent: React.FC<UserPopoverContentProps> = ({ onClose }) => {
  const docsStore = useDocsStore();
  const userProfileStore = userProfileStoreSelectors.useState();

  const signOutConfirmation = useConfirm(async () => {
    authStoreSelectors.authorized().logOut();
    onClose();
  });

  const reloadYourProfile = React.useCallback((): void => {
    authStoreSelectors.authorized().getYourProfile();
  }, []);

  React.useEffect(() => {
    reloadYourProfile();
  }, [reloadYourProfile]);

  return (
    <Modal>
      <div className="flex items-center">
        <h6 className="text-xl mr-8">Your Account</h6>
        <Button
          i={2}
          s={1}
          className="ml-auto"
          title="Open user profile settings"
          disabled={userProfileStore.is !== `ok`}
          // onClick={onSettingsOpen}
        >
          <BiEdit />
        </Button>
        <Button
          i={2}
          s={1}
          className="ml-2"
          title="Close your account panel"
          onClick={onClose}
        >
          <BiX />
        </Button>
      </div>
      <div className="flex flex-col space-y-1 mt-4">
        {docsStore.is === `ok` && docsStore.docs.length > 0 && (
          <Detail label="Documents" value={docsStore.docs.length} />
        )}
        {userProfileStore.is === `ok` && (
          <>
            <Detail
              label="Display Name"
              value={userProfileStore.user?.displayName ?? `Unset`}
            />
            <Detail label="Bio" value={userProfileStore.user?.bio ?? `Unset`} />
          </>
        )}
      </div>

      {(userProfileStore.is === `idle` || userProfileStore.is === `busy`) && (
        <div className="mt-4 flex flex-wrap gap-2">
          <DetailLoader />
          <DetailLoader />
          <DetailLoader />
          <DetailLoader />
          <DetailLoader />
        </div>
      )}

      {userProfileStore.is === `fail` && (
        <div className="mt-4 rounded-lg border-2 border-zinc-300 dark:border-zinc-800 p-4">
          <h6 className="text-red-600 dark:text-red-400 font-bold">
            Cannot load Your Profile information
          </h6>
          <p className="mt-1 mb-4">{userProfileStore.error}</p>
          <Button
            i={2}
            s={1}
            auto
            type="button"
            title="Retry your profile load"
            onClick={reloadYourProfile}
          >
            Try Again
          </Button>
        </div>
      )}

      <Button
        className="mt-10 ml-auto"
        i={2}
        s={2}
        title="Sign out"
        auto
        onClick={signOutConfirmation.confirm}
      >
        {signOutConfirmation.opened ? `Are You Sure?` : `Sign Out`}
      </Button>
    </Modal>
  );
};

export default UserPopoverContent;
