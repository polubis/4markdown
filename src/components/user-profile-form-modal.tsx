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
  notEmpty,
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
  const userProfileStore = updateUserProfileStoreSelectors.useState();
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
          notEmpty,
          noEdgeSpaces,
          minLength(2),
          maxLength(25),
          nickname,
        ],
        bio: [notEmpty, noEdgeSpaces, minLength(60), maxLength(300)],
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
      {userProfileStore.is !== `fail` && avatarErrorModal.closed && (
        <Modal>
          <div className="flex items-center justify-between gap-4 mb-6">
            <h6 className="text-xl">Your Profile Details</h6>
            <div className="flex gap-2">
              <Button
                type="button"
                i={2}
                s={1}
                disabled={userProfileStore.is === `busy`}
                title="Close user profile settings form"
                onClick={close}
              >
                <BiX />
              </Button>
            </div>
          </div>
          {userProfileStore.is === `ok` && <div>Success!</div>}
          {userProfileStore.is !== `ok` && (
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
                <Field label={`Display Name*`}>
                  <Input
                    placeholder="Examples: tom1994, work_work, pro-grammer, ...etc"
                    {...inject(`displayName`)}
                  />
                </Field>
                <Field label={`Bio*`}>
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
                  disabled={userProfileStore.is === `busy`}
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
                    untouched || invalid || userProfileStore.is === `busy`
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

      <Status open={userProfileStore.is === `busy`}>
        Updating your profile...
      </Status>

      {userProfileStore.is === `fail` && (
        <ErrorModal
          heading="Ups, something went wrong"
          message={userProfileStore.error}
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
