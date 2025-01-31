import React from 'react';
import { Button } from 'design-system/button';
import { BiEdit, BiRefresh } from 'react-icons/bi';
import { useConfirm } from 'development-kit/use-confirm';
import { Modal } from 'design-system/modal';
import { UserProfileFormModalContainer } from 'containers/user-profile-form-modal.container';
import { Avatar } from 'design-system/avatar';
import { UserSocials } from './user-socials';
import { reloadYourUserProfile } from 'actions/reload-your-user-profile.action';
import { logOut } from 'actions/log-out.action';
import { useSimpleFeature } from '@greenonsoftware/first-class-hooks';
import { useYourUserProfileState } from 'store/your-user-profile';

const DetailLoader = () => (
  <div className="flex space-x-1 h-6">
    <div className="rounded-md bg-gray-300 dark:bg-gray-800 h-full w-10" />
    <div className="rounded-md bg-gray-300 dark:bg-gray-800 h-full w-10" />
  </div>
);

const UserPopoverContent = ({ onClose }: { onClose(): void }) => {
  const yourUserProfile = useYourUserProfileState();
  const userProfileForm = useSimpleFeature();

  const signOutConfirmation = useConfirm(() => {
    logOut();
    onClose();
  });

  if (userProfileForm.isOn) {
    return (
      <UserProfileFormModalContainer
        onBack={userProfileForm.off}
        onClose={onClose}
        onSync={() => {
          userProfileForm.off();
          reloadYourUserProfile();
        }}
      />
    );
  }

  return (
    <Modal disabled={yourUserProfile.is === `busy`} onClose={onClose}>
      <Modal.Header
        title="Your Account"
        closeButtonTitle="Close your account panel"
      >
        <Button
          i={2}
          s={1}
          title="Open user profile settings"
          disabled={yourUserProfile.is !== `ok`}
          onClick={userProfileForm.on}
        >
          <BiEdit />
        </Button>
        <Button
          i={2}
          s={1}
          title="Sync your profile"
          disabled={yourUserProfile.is === `busy`}
          onClick={reloadYourUserProfile}
        >
          <BiRefresh />
        </Button>
      </Modal.Header>

      {(yourUserProfile.is === `idle` || yourUserProfile.is === `busy`) && (
        <div
          className="mt-4 flex flex-wrap gap-2"
          data-testid="[user-profile]:profile-loading"
        >
          <DetailLoader />
          <DetailLoader />
          <DetailLoader />
          <DetailLoader />
          <DetailLoader />
        </div>
      )}

      {yourUserProfile.is === `ok` && (
        <>
          {yourUserProfile.user?.displayName && yourUserProfile.user?.bio ? (
            <div
              className="mt-4 flex items-center flex-col border-zinc-300 dark:border-zinc-800 rounded-lg border-2 p-4 overflow-hidden"
              data-testid="[user-profile]:profile-ready"
            >
              <Avatar
                size="lg"
                alt="Your avatar"
                className="bg-gray-300 dark:bg-slate-800"
                char={
                  yourUserProfile.user.displayName
                    ? yourUserProfile.user.displayName.charAt(0)
                    : undefined
                }
                src={yourUserProfile.user.avatar?.lg.src}
              />
              <h6 className="mt-2 text-2xl font-bold">
                {yourUserProfile.user.displayName}
              </h6>
              <p className="mt-2 text-center">{yourUserProfile.user.bio}</p>
              <footer className="mt-4 flex space-x-3">
                <UserSocials
                  githubUrl={yourUserProfile.user.githubUrl}
                  fbUrl={yourUserProfile.user.fbUrl}
                  linkedInUrl={yourUserProfile.user.linkedInUrl}
                  twitterUrl={yourUserProfile.user.twitterUrl}
                  blogUrl={yourUserProfile.user.blogUrl}
                  createTitle={(title) => `Your ${title}`}
                />
              </footer>
            </div>
          ) : (
            <div
              className="mt-4 border-zinc-300 dark:border-zinc-800 rounded-lg border-2 p-4"
              data-testid="[user-profile]:no-profile-yet"
            >
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
                onClick={userProfileForm.on}
              >
                Create
              </Button>
            </div>
          )}
        </>
      )}

      {yourUserProfile.is === `fail` && (
        <div className="mt-4 rounded-lg border-2 border-zinc-300 dark:border-zinc-800 p-4">
          <h6 className="text-red-600 dark:text-red-400 font-bold">
            Cannot load Your Profile information
          </h6>
          <p className="mt-1 mb-4">{yourUserProfile.error.message}</p>
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
        disabled={yourUserProfile.is === `busy`}
        onClick={signOutConfirmation.confirm}
      >
        {signOutConfirmation.isOn ? `Are You Sure?` : `Sign Out`}
      </Button>
    </Modal>
  );
};

export default UserPopoverContent;
