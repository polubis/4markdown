import React from 'react';
import { Button } from 'design-system/button';
import { BiEdit, BiRefresh, BiX } from 'react-icons/bi';
import { useConfirm } from 'development-kit/use-confirm';
import { yourProfileStoreSelectors } from 'store/your-profile/your-profile.store';
import { Modal } from 'design-system/modal';
import { useToggle } from 'development-kit/use-toggle';
import { UserProfileFormModalContainer } from 'containers/user-profile-form-modal.container';
import { Avatar } from 'design-system/avatar';
import { UserSocials } from './user-socials';
import { reloadYourUserProfile } from 'actions/reload-your-user-profile.action';
import { logOut } from 'actions/log-out.action';

const DetailLoader = () => (
  <div className="flex space-x-1 h-6">
    <div className="rounded-md bg-gray-300 dark:bg-gray-800 h-full w-10" />
    <div className="rounded-md bg-gray-300 dark:bg-gray-800 h-full w-10" />
  </div>
);

const UserPopoverContent = ({ onClose }: { onClose(): void }) => {
  const yourProfileStore = yourProfileStoreSelectors.useState();
  const userProfileForm = useToggle();

  const close = (): void => {
    if (yourProfileStore.is === `busy`) return;

    onClose();
  };

  const signOutConfirmation = useConfirm(() => {
    logOut();
    close();
  });

  if (userProfileForm.opened) {
    return (
      <UserProfileFormModalContainer
        onBack={userProfileForm.close}
        onClose={close}
        onSync={() => {
          userProfileForm.close();
          reloadYourUserProfile();
        }}
      />
    );
  }

  return (
    <Modal onEscape={close}>
      <div className="flex items-center">
        <h6 className="text-xl mr-8">Your Account</h6>
        <Button
          i={2}
          s={1}
          className="ml-auto"
          title="Open user profile settings"
          disabled={yourProfileStore.is !== `ok`}
          onClick={userProfileForm.open}
        >
          <BiEdit />
        </Button>
        <Button
          i={2}
          s={1}
          className="ml-2"
          title="Sync your profile"
          disabled={yourProfileStore.is === `busy`}
          onClick={reloadYourUserProfile}
        >
          <BiRefresh />
        </Button>
        <Button
          i={2}
          s={1}
          className="ml-2"
          title="Close your account panel"
          disabled={yourProfileStore.is === `busy`}
          onClick={close}
        >
          <BiX />
        </Button>
      </div>

      {(yourProfileStore.is === `idle` || yourProfileStore.is === `busy`) && (
        <div className="mt-4 flex flex-wrap gap-2">
          <DetailLoader />
          <DetailLoader />
          <DetailLoader />
          <DetailLoader />
          <DetailLoader />
        </div>
      )}

      {yourProfileStore.is === `ok` && (
        <>
          {yourProfileStore.user?.displayName && yourProfileStore.user?.bio ? (
            <div className="mt-4 flex items-center flex-col border-zinc-300 dark:border-zinc-800 rounded-lg border-2 p-4 overflow-hidden">
              <Avatar
                size="lg"
                alt="Your avatar"
                className="bg-gray-300 dark:bg-slate-800"
                char={
                  yourProfileStore.user.displayName
                    ? yourProfileStore.user.displayName.charAt(0)
                    : undefined
                }
                src={yourProfileStore.user.avatar?.lg.src}
              />
              <h6 className="mt-2 text-2xl font-bold">
                {yourProfileStore.user.displayName}
              </h6>
              <p className="mt-2 text-center">{yourProfileStore.user.bio}</p>
              <footer className="mt-4 flex space-x-3">
                <UserSocials
                  githubUrl={yourProfileStore.user.githubUrl}
                  fbUrl={yourProfileStore.user.fbUrl}
                  linkedInUrl={yourProfileStore.user.linkedInUrl}
                  twitterUrl={yourProfileStore.user.twitterUrl}
                  blogUrl={yourProfileStore.user.blogUrl}
                  createTitle={(title) => `Your ${title}`}
                />
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
                title="Create your user profile"
                onClick={userProfileForm.open}
              >
                Create
              </Button>
            </div>
          )}
        </>
      )}

      {yourProfileStore.is === `fail` && (
        <div className="mt-4 rounded-lg border-2 border-zinc-300 dark:border-zinc-800 p-4">
          <h6 className="text-red-600 dark:text-red-400 font-bold">
            Cannot load Your Profile information
          </h6>
          <p className="mt-1 mb-4">{yourProfileStore.error.message}</p>
          <Button
            i={2}
            s={1}
            auto
            type="button"
            title="Retry your profile load"
            onClick={reloadYourUserProfile}
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
        disabled={yourProfileStore.is === `busy`}
        onClick={signOutConfirmation.confirm}
      >
        {signOutConfirmation.opened ? `Are You Sure?` : `Sign Out`}
      </Button>
    </Modal>
  );
};

export default UserPopoverContent;
