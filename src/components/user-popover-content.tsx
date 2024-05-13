import React from 'react';
import { Button } from 'design-system/button';
import {
  BiEdit,
  BiLogoFacebook,
  BiLogoGithub,
  BiLogoLinkedin,
  BiLogoTwitter,
  BiWorld,
  BiX,
} from 'react-icons/bi';
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

  React.useEffect(reloadYourProfile, [reloadYourProfile]);

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

      {(userProfileStore.is === `idle` || userProfileStore.is === `busy`) && (
        <div className="mt-4 flex flex-wrap gap-2">
          <DetailLoader />
          <DetailLoader />
          <DetailLoader />
          <DetailLoader />
          <DetailLoader />
        </div>
      )}

      {userProfileStore.is === `ok` && (
        <>
          {userProfileStore.user ? (
            <div className="mt-4 flex items-center flex-col border-zinc-300 dark:border-zinc-800 rounded-lg border-2 p-4">
              <picture className="w-[100px] h-[100px] shadow-xl rounded-full">
                <img
                  src={userProfileStore.user.avatar?.lg.src}
                  className="w-full h-full object-cover rounded-full"
                />
              </picture>
              <h6 className="mt-2 text-2xl font-bold">
                {userProfileStore.user.displayName ?? `Unset`}
              </h6>
              <p className="mt-2 text-center">
                {userProfileStore.user.bio ??
                  `You've not provided your biography yet. Go to your profile settings to change it.`}
              </p>
              <footer className="mt-4 flex space-x-3">
                <Button i={2} s={1}>
                  <BiLogoGithub />
                </Button>
                <Button i={2} s={1}>
                  <BiLogoFacebook />
                </Button>
                <Button i={2} s={1}>
                  <BiLogoLinkedin />
                </Button>
                <Button i={2} s={1}>
                  <BiLogoTwitter />
                </Button>
                <Button i={2} s={1}>
                  <BiWorld />
                </Button>
              </footer>
            </div>
          ) : (
            <div className="mt-4 border-zinc-300 dark:border-zinc-800 rounded-lg border-2 p-4">
              <h6 className="text-yellow-600 dark:text-yellow-400 font-bold">
                Make Yourself visible
              </h6>
              <p className="mt-1 mb-1">
                You have not created a <strong>profile</strong> yet. A profile
                is like a business card that allows others to recognize the
                documents you have created.
              </p>
              <i className="block mb-4">
                Profile cards may be changed or removed any time.
              </i>
              <Button
                i={2}
                s={1}
                auto
                type="button"
                title="Create your user profile"
                onClick={reloadYourProfile}
              >
                Create
              </Button>
            </div>
          )}
        </>
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

      <div className="flex flex-wrap gap-x-3 gap-y-2 mt-2">
        {docsStore.is === `ok` && docsStore.docs.length > 0 && (
          <Detail label="Documents" value={docsStore.docs.length} />
        )}
      </div>

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
