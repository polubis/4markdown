import React from "react";
import { Button } from "design-system/button";
import { BiPencil, BiRefresh, BiSolidUserDetail } from "react-icons/bi";
import { useConfirm } from "development-kit/use-confirm";
import { Modal2 } from "design-system/modal2";
import { UserProfileFormModalContainer } from "containers/user-profile-form-modal.container";
import { Avatar } from "design-system/avatar";
import { UserSocials } from "./user-socials";
import { logOutAct } from "acts/log-out.act";
import { reloadYourUserProfileAct } from "acts/reload-your-user-profile.act";
import { useSimpleFeature } from "@greenonsoftware/react-kit";
import { useYourUserProfileState } from "store/your-user-profile";
import { useYourAccountState } from "store/your-account";
import { reloadYourAccountAct } from "acts/reload-your-account.act";
import { navigate } from "gatsby";
import { meta } from "../../meta";
import { Err } from "design-system/err";
import { BiError } from "react-icons/bi";

const UserPopoverContent = ({ onClose }: { onClose(): void }) => {
  const yourUserProfile = useYourUserProfileState();
  const userProfileForm = useSimpleFeature();
  const yourAccount = useYourAccountState();

  const signOutConfirmation = useConfirm(() => {
    logOutAct();
    onClose();
  });

  const goToUserProfile = () => {
    onClose();

    if (yourUserProfile.is === `ok` && yourUserProfile.user?.id) {
      navigate(
        meta.routes.userProfile.preview +
          `?profileId=${yourUserProfile.user.id}`,
      );
    }
  };

  if (userProfileForm.isOn) {
    return (
      <UserProfileFormModalContainer
        onBack={userProfileForm.off}
        onClose={onClose}
        onSync={() => {
          userProfileForm.off();
          reloadYourUserProfileAct();
        }}
      />
    );
  }

  const isCloseDisabled =
    yourUserProfile.is === `busy` || yourAccount.is === `busy`;

  return (
    <Modal2 disabled={isCloseDisabled} onClose={onClose}>
      <Modal2.Header
        title="Your Account & Profile"
        closeButtonTitle="Close your account panel"
      />

      <Modal2.Body>
        <div className="flex flex-col gap-3">
          {(yourUserProfile.is === `idle` || yourUserProfile.is === `busy`) && (
            <div
              className="rounded-md bg-gradient-to-r from-gray-300 via-zinc-200 to-gray-200 dark:from-gray-800 dark:via-zinc-800 dark:to-gray-900 animate-gradient-move bg-[length:200%_200%] h-[120px] w-full"
              data-testid="[user-profile]:profile-loading"
            />
          )}

          {yourUserProfile.is === `ok` && (
            <>
              {yourUserProfile.user?.displayName &&
              yourUserProfile.user?.bio ? (
                <>
                  <div
                    className="relative flex items-center flex-col border-zinc-300 dark:border-zinc-800 rounded-lg border-2 p-4 overflow-hidden"
                    data-testid="[user-profile]:profile-ready"
                  >
                    <div className="absolute flex flex-col gap-2 top-2 right-2">
                      <Button
                        i={1}
                        s={1}
                        title="Open user profile settings"
                        onClick={userProfileForm.on}
                      >
                        <BiPencil />
                      </Button>
                      <Button
                        i={1}
                        s={1}
                        title="Sync your profile"
                        onClick={reloadYourUserProfileAct}
                      >
                        <BiRefresh />
                      </Button>
                      {yourUserProfile.user && (
                        <Button
                          i={1}
                          s={1}
                          title="See your public profile"
                          onClick={goToUserProfile}
                        >
                          <BiSolidUserDetail />
                        </Button>
                      )}
                    </div>
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
                    <h6 className="mt-2 text-lg font-bold">
                      {yourUserProfile.user.displayName}
                    </h6>
                    <p className="text-center">{yourUserProfile.user.bio}</p>
                    <div className="mt-4 flex space-x-3">
                      <UserSocials
                        githubUrl={yourUserProfile.user.githubUrl}
                        fbUrl={yourUserProfile.user.fbUrl}
                        linkedInUrl={yourUserProfile.user.linkedInUrl}
                        twitterUrl={yourUserProfile.user.twitterUrl}
                        blogUrl={yourUserProfile.user.blogUrl}
                        createTitle={(title) => `Your ${title}`}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div
                  className="border-zinc-300 dark:border-zinc-800 rounded-lg border-2 p-4"
                  data-testid="[user-profile]:no-profile-yet"
                >
                  <h6 className="font-bold">Make Yourself visible</h6>
                  <p className="mt-1 mb-1">
                    You have not created a <strong>profile</strong> yet. A
                    profile is like a business card that allows others to
                    recognize the documents you have created.
                  </p>
                  <i className="block mb-2">
                    Profile cards may be changed or removed any time.
                  </i>
                  <div className="flex gap-2 justify-end translate-y-2 translate-x-2">
                    <Button
                      i={1}
                      s={1}
                      title="Open user profile settings"
                      onClick={userProfileForm.on}
                    >
                      <BiPencil />
                    </Button>
                    <Button
                      i={1}
                      s={1}
                      title="Sync your profile"
                      onClick={reloadYourUserProfileAct}
                    >
                      <BiRefresh />
                    </Button>
                    {yourUserProfile.user && (
                      <Button
                        i={1}
                        s={1}
                        title="See your public profile"
                        onClick={goToUserProfile}
                      >
                        <BiSolidUserDetail />
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {yourUserProfile.is === `fail` && (
            <div className="rounded-lg border-2 border-zinc-300 dark:border-zinc-800 p-4">
              <h6 className="text-red-600 dark:text-red-400 font-bold capitalize">
                Cannot load Your Profile information
              </h6>
              <p className="mt-1 mb-4">{yourUserProfile.error.message}</p>
              <Button
                i={2}
                s={1}
                auto
                title="Retry your profile load"
                onClick={reloadYourUserProfileAct}
              >
                Try Again
              </Button>
            </div>
          )}

          {(yourAccount.is === `idle` || yourAccount.is === `busy`) && (
            <div
              className="rounded-md bg-gradient-to-r from-gray-300 via-zinc-200 to-gray-200 dark:from-gray-800 dark:via-zinc-800 dark:to-gray-900 animate-gradient-move bg-[length:200%_200%] h-[120px] w-full"
              data-testid="[user-profile]:account-loading"
            />
          )}

          {yourAccount.is === `ok` && (
            <div className="relative border-zinc-300 dark:border-zinc-800 rounded-lg border-2 p-4">
              <Button
                i={1}
                s={1}
                className="absolute top-2 right-2"
                title="Resync your account"
                onClick={reloadYourAccountAct}
              >
                <BiRefresh />
              </Button>
              <h6 className="font-bold">Your Account Balance</h6>
              {yourAccount.balance.tokens > 0 ? (
                <p className="mt-1">
                  You&apos;ve still{" "}
                  <strong>{yourAccount.balance.tokens}</strong>
                  {` `}
                  tokens to use.
                </p>
              ) : (
                <p className="mt-1">You have no tokens left.</p>
              )}
              <p className="mt-1">
                <i>
                  Your tokens are <strong>refilled to 50 every 24 hours</strong>
                </i>
              </p>
            </div>
          )}

          {yourAccount.is === `fail` && (
            <Err className="py-4">
              <Err.Icon>
                <BiError size={80} />
              </Err.Icon>
              <Err.Title>Cannot load your account information</Err.Title>
              <Err.Description>{yourAccount.error.message}</Err.Description>
              <Err.Action
                title="Retry your account load"
                auto
                s={2}
                i={2}
                onClick={reloadYourAccountAct}
              >
                Try again
              </Err.Action>
            </Err>
          )}
        </div>
      </Modal2.Body>

      <Modal2.Footer>
        <Button
          className="ml-auto"
          i={2}
          s={2}
          title="Sign out"
          auto
          disabled={isCloseDisabled}
          onClick={signOutConfirmation.confirm}
        >
          {signOutConfirmation.isOn ? `Are You Sure?` : `Sign Out`}
        </Button>
      </Modal2.Footer>
    </Modal2>
  );
};

export default UserPopoverContent;
