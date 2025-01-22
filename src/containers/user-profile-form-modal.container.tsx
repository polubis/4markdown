import type { API4MarkdownPayload } from 'api-4markdown-contracts';
import ErrorModal from 'components/error-modal';
import { Avatar } from 'design-system/avatar';
import { Button } from 'design-system/button';
import { Field } from 'design-system/field';
import { Input } from 'design-system/input';
import { Modal } from 'design-system/modal';
import { Status } from 'design-system/status';
import { Textarea } from 'design-system/textarea';
import { readFileAsBase64 } from 'development-kit/file-reading';
import type { ValidatorsSetup } from 'development-kit/form';
import {
  base64,
  maxLength,
  minLength,
  optional,
  url,
} from 'development-kit/form';
import { useFileInput } from 'development-kit/use-file-input';
import { useForm } from 'development-kit/use-form';
import type {
  NonNullableProperties,
  Prettify,
} from 'development-kit/utility-types';
import React from 'react';
import {
  updateYourProfileStoreActions,
  updateYourProfileStoreSelectors,
} from 'store/update-your-profile/update-your-profile.store';
import { updateYourUserProfile } from 'actions/update-your-user-profile.action';
import { useSimpleFeature } from 'development-kit/use-simple-feature';
import { type YourUserProfileOkState } from 'store/your-user-profile/models';
import { useYourUserProfileState } from 'store/your-user-profile';
import { yourOkUserProfileSelector } from 'store/your-user-profile/selectors';

interface UserProfileFormModalContainerProps {
  onClose(): void;
  onBack(): void;
  onSync(): void;
}

type UserProfileFormValues = Prettify<
  Omit<
    NonNullableProperties<API4MarkdownPayload<'updateYourUserProfileV2'>>,
    'mdate'
  > & { mdate: API4MarkdownPayload<'updateYourUserProfileV2'>['mdate'] }
>;

const avatarFormats = [`png`, `jpeg`, `jpg`, `webp`] as const;
const avatarRestrictions = {
  type: avatarFormats.map((extension) => `image/${extension}`).join(`, `),
  size: 4,
};

const urlValidator = [optional(url)];

// @TODO[PRIO=4]: [Simplify this component logic].
const createInitialValues = ({
  user,
  mdate,
}: YourUserProfileOkState): UserProfileFormValues => ({
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
  displayName: [optional(minLength(2), maxLength(30))],
  bio: [optional(minLength(20), maxLength(500))],
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
  const yourProfileStore = useYourUserProfileState(yourOkUserProfileSelector);
  const updateYourProfileStore = updateYourProfileStoreSelectors.useState();
  const [avatarPreview, setAvatarPreview] = React.useState(
    yourProfileStore.user?.avatar?.lg.src ?? ``,
  );
  const avatarErrorModal = useSimpleFeature();
  const [{ invalid, values, untouched, result }, { inject, set }] = useForm(
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
            avatarErrorModal.on();
          }
        }
      };

      uploadAndOpen();
    },
    onError: avatarErrorModal.on,
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
      {updateYourProfileStore.is !== `fail` && avatarErrorModal.isOff && (
        <Modal disabled={updateYourProfileStore.is === `busy`} onClose={close}>
          <Modal.Header
            title="Your Profile Edition"
            closeButtonTitle="Your Profile Edition"
          />
          <form onSubmit={save}>
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

      {avatarErrorModal.isOn && (
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
          onClose={avatarErrorModal.off}
        />
      )}
    </>
  );
};

export { UserProfileFormModalContainer };
