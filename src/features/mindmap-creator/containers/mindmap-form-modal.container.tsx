import { Button } from "design-system/button";
import { Field } from "design-system/field";
import { Hint } from "design-system/hint";
import { Input } from "design-system/input";
import { Textarea } from "design-system/textarea";
import { maxLength, minLength, optional } from "development-kit/form";
import { useForm } from "development-kit/use-form";
import React, { type FormEventHandler } from "react";
import { BiPlusCircle } from "react-icons/bi";
import { Modal } from "design-system/modal";
import {
	backToMindmapDetailsAction,
	closeMindmapFormAction,
} from "store/mindmap-creator/actions";
import { createMindmapAct } from "acts/create-mindmap.act";
import { validationLimits } from "../core/validation";
import { useMindmapCreatorState } from "store/mindmap-creator";
import { openedMindmapFormSelector } from "store/mindmap-creator/selectors";
import { updateMindmapAct } from "acts/update-mindmap.act";

const MindmapFormModalContainer = () => {
	const { operation } = useMindmapCreatorState();
	const mindmapForm = useMindmapCreatorState((state) =>
		openedMindmapFormSelector(state.mindmapForm),
	);

	const [initialValues] = React.useState(() =>
		mindmapForm.is === `active`
			? {
					name: ``,
					description: ``,
					tags: ``,
				}
			: {
					name: mindmapForm.name,
					description: mindmapForm.description ?? ``,
					tags: Array.isArray(mindmapForm.tags)
						? mindmapForm.tags.join(`,`)
						: ``,
				},
	);

	const [{ values, untouched, invalid }, { inject }] = useForm(initialValues, {
		name: [
			minLength(validationLimits.name.min),
			maxLength(validationLimits.name.max),
		],
		description: [
			optional(
				minLength(validationLimits.description.min),
				maxLength(validationLimits.description.max),
			),
		],
	});

	const confirmCreation: FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();

		const name = values.name.trim();
		const description = values.description.trim();
		const tags = values.tags.trim();
		const splittedTags = tags.length === 0 ? [] : tags.split(`,`);

		const payload = {
			name,
			description: description.length === 0 ? null : description,
			tags: splittedTags.length === 0 ? null : splittedTags,
		};

		if (mindmapForm.is === `active`) {
			createMindmapAct(payload);

			return;
		}

		updateMindmapAct(payload);
	};

	const splittedTags = React.useMemo(
		() =>
			values.tags
				.split(`,`)
				.map((tag) => tag.trim())
				.filter((tag) => tag.length > 0).length,
		[values.tags],
	);

	return (
		<Modal disabled={operation.is === `busy`} onClose={closeMindmapFormAction}>
			{mindmapForm.is === `edition` ? (
				<Modal.Header
					title={
						<>
							Edit <strong>{mindmapForm.name}</strong> Mindmap
						</>
					}
					closeButtonTitle="Cancel mindmap edition"
				/>
			) : (
				<>
					<Modal.Header
						title="Create Mindmap"
						closeButtonTitle="Cancel mindmap creation"
					/>
					<p className="text-sm mb-4">
						Mindmap will be created in <strong>private mode</strong>. Visible
						only to you, but data inside is{` `}
						<strong>not encrypted</strong> -{` `}
						<strong>avoid sensitive data</strong>
					</p>
				</>
			)}

			<form className="flex flex-col gap-3" onSubmit={confirmCreation}>
				<Field
					label="Name*"
					hint={
						<Hint
							trigger={
								<>
									{validationLimits.name.min} - {validationLimits.name.max}
									{` `}
									characters
								</>
							}
						/>
					}
				>
					<Input
						placeholder={`My Mindmap, Basics of Computer Science, ...etc`}
						{...inject(`name`)}
					/>
				</Field>
				<Field
					label="Description"
					hint={
						<Hint
							trigger={
								<>
									{validationLimits.description.min} -{` `}
									{validationLimits.description.max}
									{` `}
									characters
								</>
							}
						/>
					}
				>
					<Textarea
						placeholder="My private or public roadmap for learning something important to me..."
						{...inject(`description`)}
					/>
				</Field>
				<Field
					label={splittedTags === 0 ? `Tags` : `Tags (${splittedTags})`}
					hint={<Hint trigger={`Comma-separated, 1-10 tags, each unique`} />}
				>
					<Input
						placeholder="React, ruby-on-rails, c++, c# ...etc"
						{...inject(`tags`)}
					/>
				</Field>
				<footer className="mt-6 flex space-x-3">
					{mindmapForm.is === `active` ? (
						<Button
							type="submit"
							i={2}
							s={2}
							auto
							className="flex-1"
							title="Confirm mindmap creation"
							disabled={operation.is === `busy` || untouched || invalid}
						>
							Create
							<BiPlusCircle />
						</Button>
					) : (
						<>
							<Button
								type="button"
								i={1}
								s={2}
								className="flex-1"
								auto
								title="Back to mindmap details"
								disabled={operation.is === `busy`}
								onClick={backToMindmapDetailsAction}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								i={2}
								s={2}
								className="flex-1"
								auto
								title="Confirm mindmap update"
								disabled={operation.is === `busy` || untouched || invalid}
							>
								Submit
							</Button>
						</>
					)}
				</footer>
			</form>
		</Modal>
	);
};

export { MindmapFormModalContainer };
