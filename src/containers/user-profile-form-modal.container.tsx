import type { API4MarkdownPayload } from 'api-4markdown-contracts';
import ErrorModal from 'components/error-modal';
import { Avatar } from 'design-system/avatar';
import { Button } from 'design-system/button';
import { Field } from 'design-system/field';
import { Input } from 'design-system/input';
import Modal from 'design-system/modal';
import { Status } from 'design-system/status';
import { Textarea } from 'design-system/textarea';
import { readFileAsBase64 } from 'development-kit/file-reading';
import type { ValidatorsSetup } from 'development-kit/form';
import {
  base64,
  maxLength,
  minLength,
  nickname,
  noEdgeSpaces,
  optional,
  url,
} from 'development-kit/form';
import { useFileInput } from 'development-kit/use-file-input';
import { useForm } from 'development-kit/use-form';
import { useToggle } from 'development-kit/use-toggle';
import type { NonNullableProperties } from 'development-kit/utility-types';
import React from 'react';
import { BiX } from 'react-icons/bi';
import {
  updateYourProfileStoreActions,
  updateYourProfileStoreSelectors,
} from 'store/update-your-profile/update-your-profile.store';
import { updateYourUserProfile } from 'store/update-your-profile/update-your-user-profile.action';
import type { YourProfileStoreOkState } from 'store/your-profile/your-profile.store';
import { yourProfileStoreSelectors } from 'store/your-profile/your-profile.store';

interface UserProfileFormModalContainerProps {
  onClose(): void;
  onBack(): void;
  onSync(): void;
}

type UserProfileFormValues = Omit<
  NonNullableProperties<API4MarkdownPayload<'updateYourUserProfile'>>,
  'mdate'
> & { mdate: API4MarkdownPayload<'updateYourUserProfile'>['mdate'] };

const avatarFormats = [`png`, `jpeg`, `jpg`, `webp`] as const;
const avatarRestrictions = {
  type: avatarFormats.map((extension) => `image/${extension}`).join(`, `),
  size: 4,
};

const urlValidator = [optional(noEdgeSpaces, url)];

// @TODO[PRIO=4]: [Simplify this component logic].
const createInitialValues = ({
  user,
  mdate,
}: YourProfileStoreOkState): UserProfileFormValues => ({
  displayName: user?.displayName ?? ``,
  bio: user?.bio ?? ``,
  avatar: { type: `noop` },
  githubUrl: user?.githubUrl ?? ``,
  linkedInUrl: user?.linkedInUrl ?? ``,
  fbUrl: user?.fbUrl ?? ``,
  twitterUrl: user?.twitterUrl ?? ``,
  blogUrl: user?.blogUrl ?? ``,
  mdate,
});

const validators: ValidatorsSetup<UserProfileFormValues> = {
  avatar: [(value) => (value.type === `update` ? base64(value.data) : null)],
  displayName: [optional(noEdgeSpaces, minLength(2), maxLength(25), nickname)],
  bio: [optional(noEdgeSpaces, minLength(60), maxLength(300))],
  githubUrl: urlValidator,
  blogUrl: urlValidator,
  linkedInUrl: urlValidator,
  fbUrl: urlValidator,
  twitterUrl: urlValidator,
};

const UserProfileFormModalContainer = ({
  onClose,
  onBack,
  onSync,
}: UserProfileFormModalContainerProps) => {
  const yourProfileStore = yourProfileStoreSelectors.useOk();
  const updateYourProfileStore = updateYourProfileStoreSelectors.useState();
  const [avatarPreview, setAvatarPreview] = React.useState(
    yourProfileStore.user?.avatar?.lg.src ?? ``,
  );
  const avatarErrorModal = useToggle();
  const [{ invalid, values, untouched, result }, { inject, set }] =
    useForm<UserProfileFormValues>(
      createInitialValues(yourProfileStore),
      validators,
    );

  const close = (): void => {
    updateYourProfileStoreActions.idle();
    onClose();
  };

  const back = (): void => {
    updateYourProfileStoreActions.idle();
    onBack();
  };

  const save = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    updateYourUserProfile(
      {
        displayName: values.displayName || null,
        bio: values.bio || null,
        twitterUrl: values.twitterUrl || null,
        fbUrl: values.fbUrl || null,
        githubUrl: values.githubUrl || null,
        blogUrl: values.blogUrl || null,
        linkedInUrl: values.linkedInUrl || null,
        avatar: values.avatar,
        mdate: values.mdate,
      },
      back,
    );
  };

  const [uploadAvatar] = useFileInput({
    accept: avatarRestrictions.type,
    maxSize: avatarRestrictions.size,
    onChange: ({ target: { files } }) => {
      const uploadAndOpen = async (): Promise<void> => {
        if (!!files && files.length === 1) {
          try {
            const avatar = await readFileAsBase64(files[0]);
            setAvatarPreview(avatar);
            set({
              avatar: {
                data: avatar,
                type: `update`,
              },
            });
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
    set({
      avatar: yourProfileStore.user?.avatar
        ? { type: `remove` }
        : { type: `noop` },
    });
    setAvatarPreview(``);
  };

  return (
    <>
      {updateYourProfileStore.is !== `fail` && avatarErrorModal.closed && (
        <Modal>
          <form onSubmit={save}>
            <div className="flex items-center">
              <h6 className="text-xl mr-8">Your Profile Edition</h6>
              <Button
                i={2}
                s={1}
                className="ml-auto"
                type="button"
                title="Close your profile form"
                disabled={updateYourProfileStore.is === `busy`}
                onClick={close}
              >
                <BiX />
              </Button>
            </div>

            <div className="flex flex-col space-y-3 mt-8">
              <Field className="items-center mx-auto [&>label]:mb-2">
                <Button
                  type="button"
                  rounded
                  title="Add your avatar"
                  className="bg-gray-300 dark:bg-slate-800"
                  s="auto"
                  i={1}
                  onClick={uploadAvatar}
                >
                  <Avatar
                    alt="Your avatar"
                    size="lg"
                    char={
                      result.displayName
                        ? undefined
                        : values.displayName.charAt(0)
                    }
                    src={avatarPreview}
                  />
                </Button>
                {avatarPreview && (
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
                  placeholder="https://facebook.com/your-profile"
                  {...inject(`fbUrl`)}
                />
              </Field>
              <Field label={`LinkedIn Link`}>
                <Input
                  placeholder="https://linkedin.com/your-profile"
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
            </div>

            <footer className="flex items-center justify-end mt-8 space-x-2">
              <Button
                i={1}
                s={2}
                auto
                type="button"
                title="Back to user profile"
                disabled={updateYourProfileStore.is === `busy`}
                onClick={back}
              >
                Back
              </Button>
              <Button
                i={2}
                s={2}
                auto
                type="submit"
                title="Save user profile"
                disabled={
                  untouched || invalid || updateYourProfileStore.is === `busy`
                }
              >
                Save
              </Button>
            </footer>
          </form>
        </Modal>
      )}

      {updateYourProfileStore.is === `busy` && (
        <Status>Updating your profile...</Status>
      )}

      {updateYourProfileStore.is === `fail` && (
        <ErrorModal
          heading="Ups, something went wrong"
          message={updateYourProfileStore.error.message}
          footer={
            updateYourProfileStore.error.symbol === `out-of-date` && (
              <Button
                type="button"
                i={2}
                s={2}
                auto
                title="Sync Your profile"
                onClick={() => {
                  updateYourProfileStoreActions.idle();
                  onSync();
                }}
              >
                Sync
              </Button>
            )
          }
          onClose={updateYourProfileStoreActions.idle}
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

export { UserProfileFormModalContainer };
