import type { API4MarkdownPayload } from "api-4markdown-contracts";
import ErrorModal from "components/error-modal";
import { Avatar } from "design-system/avatar";
import { Button } from "design-system/button";
import { Field } from "design-system/field";
import { Input } from "design-system/input";
import { Modal } from "design-system/modal";
import { Status } from "design-system/status";
import { Textarea } from "design-system/textarea";
import { readFileAsBase64 } from "development-kit/file-reading";
import type { ValidatorsSetup } from "development-kit/form";
import { maxLength, minLength, optional, url } from "development-kit/form";
import { useFileInput } from "development-kit/use-file-input";
import { useForm } from "development-kit/use-form";
import type { NonNullableProperties } from "development-kit/utility-types";
import React from "react";
import {
	updateYourProfileStoreActions,
	updateYourProfileStoreSelectors,
} from "store/update-your-profile/update-your-profile.store";
import { useSimpleFeature } from "@greenonsoftware/react-kit";
import type { YourUserProfileOkState } from "store/your-user-profile/models";
import { useYourUserProfileState } from "store/your-user-profile";
import { yourOkUserProfileSelector } from "store/your-user-profile/selectors";
import { updateYourUserProfileAct } from "acts/update-your-user-profile.act";
import { Hint } from "design-system/hint";

interface UserProfileFormModalContainerProps {
	onClose(): void;
	onBack(): void;
	onSync(): void;
}

type UserProfileFormValues = NonNullableProperties<
	Pick<
		API4MarkdownPayload<"updateYourUserProfileV2">,
		| "displayName"
		| "bio"
		| "avatar"
		| "blogUrl"
		| "fbUrl"
		| "githubUrl"
		| "linkedInUrl"
		| "twitterUrl"
	>
> & { mdate: API4MarkdownPayload<"updateYourUserProfileV2">["mdate"] };

const avatarFormats = [`png`, `jpeg`, `jpg`, `webp`] as const;
const avatarRestrictions = {
	type: avatarFormats.map((extension) => `image/${extension}`).join(`, `),
	size: 4,
};

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

const limits: Record<
	keyof Pick<UserProfileFormValues, "displayName" | "bio">,
	{ min: number; max: number }
> = {
	displayName: {
		min: 2,
		max: 30,
	},
	bio: {
		min: 20,
		max: 500,
	},
};

const urlValidator = [optional(url)];

const validators: ValidatorsSetup<UserProfileFormValues> = {
	displayName: [
		optional(
			minLength(limits.displayName.min),
			maxLength(limits.displayName.max),
		),
	],
	bio: [optional(minLength(limits.bio.min), maxLength(limits.bio.max))],
	githubUrl: urlValidator,
	blogUrl: urlValidator,
	linkedInUrl: urlValidator,
	fbUrl: urlValidator,
	twitterUrl: urlValidator,
};

const displayCounting = (value: string): string => {
	const trimmed = value.trim();

	return trimmed.length > 0 ? `(${trimmed.length})` : ``;
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

		const result = await updateYourUserProfileAct({
			displayName: values.displayName || null,
			bio: values.bio || null,
			twitterUrl: values.twitterUrl || null,
			fbUrl: values.fbUrl || null,
			githubUrl: values.githubUrl || null,
			blogUrl: values.blogUrl || null,
			linkedInUrl: values.linkedInUrl || null,
			avatar: values.avatar,
			mdate: values.mdate,
		});

		result.is === `ok` && back();
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
						closeButtonTitle="Close your profile form"
					/>
					<form onSubmit={save} data-testid="[user-profile-form]:container">
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
							<Field
								label={`Display Name ${displayCounting(values.displayName)}`}
								hint={
									<Hint
										trigger={`Enter any characters with a length between ${limits.displayName.min} and ${limits.displayName.max}`}
									/>
								}
							>
								<Input
									placeholder="Examples: tom1994, work_work, pro-grammer, ...etc"
									{...inject(`displayName`)}
								/>
							</Field>
							<Field
								label={`Bio ${displayCounting(values.bio)}`}
								hint={
									<Hint
										trigger={`Enter any characters with a length between ${limits.bio.min} and ${limits.bio.max}`}
									/>
								}
							>
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
