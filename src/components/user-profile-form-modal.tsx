import React from 'react';
import { Button } from 'design-system/button';
import { BiUser, BiX } from 'react-icons/bi';
import Modal from 'design-system/modal';
import { Field } from 'design-system/field';
import { Input } from 'design-system/input';
import { Textarea } from 'design-system/textarea';
import { UserProfile } from 'models/user';
import { NonNullableProperties } from 'development-kit/utility-types';
import { useForm } from 'development-kit/use-form';
import {
  base64Blob,
  maxLength,
  minLength,
  nickname,
  noEdgeSpaces,
  optional,
  url,
} from 'development-kit/form';
import {
  updateUserProfileStoreActions,
  updateUserProfileStoreSelectors,
} from 'store/update-user-profile/update-user-profile.store';
import { authStoreSelectors } from 'store/auth/auth.store';
import { Status } from 'design-system/status';
import { ErrorModal } from './error-modal';
import { useFileInput } from 'development-kit/use-file-input';
import { useToggle } from 'development-kit/use-toggle';
import { readFileAsBase64 } from 'development-kit/file-reading';

interface UserProfileFormModalProps {
  onClose(): void;
}

type UserProfileFormValues = NonNullableProperties<UserProfile>;

const urlValidator = [optional(noEdgeSpaces, url)];

const avatarFormats = [`png`, `jpeg`, `jpg`, `webp`] as const;
const avatarRestrictions = {
  type: avatarFormats.map((extension) => `image/${extension}`).join(`, `),
  size: 4,
};

const UserProfileFormModal = ({ onClose }: UserProfileFormModalProps) => {
  const updateUserProfileStore = updateUserProfileStoreSelectors.useState();
  const [{ invalid, values, untouched }, { inject, set }] =
    useForm<UserProfileFormValues>(
      {
        displayName: ``,
        bio: ``,
        avatar: ``,
        githubUrl: ``,
        linkedInUrl: ``,
        fbUrl: ``,
        twitterUrl: ``,
        blogUrl: ``,
      },
      {
        avatar: [optional(base64Blob)],
        displayName: [
          optional(noEdgeSpaces, minLength(2), maxLength(25), nickname),
        ],
        bio: [optional(noEdgeSpaces, minLength(60), maxLength(300))],
        githubUrl: urlValidator,
        blogUrl: urlValidator,
        linkedInUrl: urlValidator,
        fbUrl: urlValidator,
        twitterUrl: urlValidator,
      },
    );
  const avatarErrorModal = useToggle();

  const save = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    await authStoreSelectors.authorized().updateUserProfile(values);
  };

  const close = (): void => {
    updateUserProfileStoreActions.idle();
    onClose();
  };

  const [uploadAvatar] = useFileInput({
    accept: avatarRestrictions.type,
    maxSize: avatarRestrictions.size,
    onChange: ({ target: { files } }) => {
      const uploadAndOpen = async (): Promise<void> => {
        if (!!files && files.length === 1) {
          try {
            set({ avatar: await readFileAsBase64(files[0]) });
          } catch {
            avatarErrorModal.open();
          }
        }
      };

      uploadAndOpen();
    },
    onError: avatarErrorModal.open,
  });

  const removeAvatar = (): void => {
    set({ avatar: `` });
  };

  return (
    <>
      {updateUserProfileStore.is !== `fail` && avatarErrorModal.closed && (
        <Modal>
          <div className="flex items-center justify-between gap-4 mb-6">
            <h6 className="text-xl">Your Profile Details</h6>
            <div className="flex gap-2">
              <Button
                type="button"
                i={2}
                s={1}
                disabled={updateUserProfileStore.is === `busy`}
                title="Close user profile update form"
                onClick={close}
              >
                <BiX />
              </Button>
            </div>
          </div>
          {updateUserProfileStore.is === `ok` && (
            <div>
              <p className="text-md text-green-700 mb-2">
                <strong>Your profile has been successfully updated!</strong>
              </p>
              <p>
                Below are your current details. Remember, you can remove them at
                any time.
              </p>
              <div className="bg-zinc-300 dark:bg-zinc-800 h-0.5 my-4" />
              <p className="mb-1">
                Display Name:{` `}
                <strong className="break-words">{values.displayName}</strong>
              </p>
              <p className="mb-1">
                Bio:{` `}
                <strong className="break-words">{values.bio}</strong>
              </p>
              <p className="mb-1">
                GitHub Link:{` `}
                <strong className="break-words">{values.githubUrl}</strong>
              </p>
              <p className="mb-1">
                Facebook Link:{` `}
                <strong className="break-words">{values.fbUrl}</strong>
              </p>
              <p className="mb-1">
                Twitter Link:{` `}
                <strong className="break-words">{values.twitterUrl}</strong>
              </p>
              <p className="mb-1">
                LinkedIn Link:{` `}
                <strong className="break-words">{values.linkedInUrl}</strong>
              </p>
              <p className="mb-1">
                Blog Link:{` `}
                <strong className="break-words">{values.blogUrl}</strong>
              </p>

              <footer className="flex mt-8">
                <Button
                  className="ml-auto"
                  type="button"
                  i={1}
                  s={2}
                  auto
                  title="Close user profile update success summary"
                  onClick={close}
                >
                  Close
                </Button>
                <Button
                  className="ml-2"
                  type="button"
                  i={1}
                  s={2}
                  auto
                  title="Edit your profile again"
                  onClick={updateUserProfileStoreActions.idle}
                >
                  Edit Again
                </Button>
              </footer>
            </div>
          )}
          {updateUserProfileStore.is !== `ok` && (
            <form onSubmit={save}>
              <section className="flex flex-col space-y-4">
                <Field className="items-center mx-auto [&>label]:mb-2" label="">
                  <Button
                    className="w-[100px] h-[100px]"
                    type="button"
                    rounded
                    title="Add your avatar"
                    s={2}
                    i={2}
                    onClick={uploadAvatar}
                  >
                    {values.avatar ? (
                      <img
                        className="h-full w-full object-cover rounded-full"
                        src={values.avatar}
                      />
                    ) : (
                      <BiUser size={32} />
                    )}
                  </Button>
                  {values.avatar && (
                    <Button
                      type="button"
                      auto
                      className="mt-2"
                      s={1}
                      i={2}
                      onClick={removeAvatar}
                    >
                      Remove
                    </Button>
                  )}
                </Field>
                <Field label={`Display Name`}>
                  <Input
                    placeholder="Examples: tom1994, work_work, pro-grammer, ...etc"
                    {...inject(`displayName`)}
                  />
                </Field>
                <Field label={`Bio`}>
                  <Textarea
                    placeholder="Example: I like programming and playing computer games..."
                    {...inject(`bio`)}
                  />
                </Field>
                <Field label={`GitHub Link`}>
                  <Input
                    placeholder="https://github.com/your-profile"
                    {...inject(`githubUrl`)}
                  />
                </Field>
                <Field label={`Facebook Link`}>
                  <Input
                    placeholder="https://www.facebook.com/your-profile"
                    {...inject(`fbUrl`)}
                  />
                </Field>
                <Field label={`LinkedIn Link`}>
                  <Input
                    placeholder="https://www.linkedin.com/your-profile"
                    {...inject(`linkedInUrl`)}
                  />
                </Field>
                <Field label={`Twitter Link`}>
                  <Input
                    placeholder="https://twitter.com/your-profile"
                    {...inject(`twitterUrl`)}
                  />
                </Field>
                <Field label={`Blog`}>
                  <Input
                    placeholder="https://your-blog-domain"
                    {...inject(`blogUrl`)}
                  />
                </Field>
              </section>
              <footer className="mt-10 flex">
                <Button
                  className="ml-auto"
                  type="button"
                  i={1}
                  s={2}
                  disabled={updateUserProfileStore.is === `busy`}
                  auto
                  title="Cancel user profile update"
                  onClick={close}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="ml-2"
                  i={2}
                  s={2}
                  auto
                  disabled={
                    untouched || invalid || updateUserProfileStore.is === `busy`
                  }
                  title="Confirm user profile update"
                >
                  Confirm
                </Button>
              </footer>
            </form>
          )}
        </Modal>
      )}

      <Status open={updateUserProfileStore.is === `busy`}>
        Updating your profile...
      </Status>

      {updateUserProfileStore.is === `fail` && (
        <ErrorModal
          heading="Ups, something went wrong"
          message={updateUserProfileStore.error}
          onClose={updateUserProfileStoreActions.idle}
        />
      )}

      {avatarErrorModal.opened && (
        <ErrorModal
          heading="Invalid avatar"
          message={
            <>
              Please ensure that the avatar format is valid. Supported formats
              include <strong>{avatarFormats.join(`, `)}</strong>, with a
              maximum file size of{` `}
              <strong>{avatarRestrictions.size} megabytes</strong>
            </>
          }
          onClose={avatarErrorModal.close}
        />
      )}
    </>
  );
};

export default UserProfileFormModal;
