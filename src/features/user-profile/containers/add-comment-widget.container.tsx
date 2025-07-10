import { API4MarkdownPayload } from "api-4markdown-contracts";
import { Button } from "design-system/button";
import { Field } from "design-system/field";
import { Modal2 } from "design-system/modal2";
import { Textarea } from "design-system/textarea";
import { maxLength, minLength } from "development-kit/form";
import { useForm } from "development-kit/use-form";
import React from "react";
import { AddUserProfileCommentFormValues } from "../models";
import { addUserProfileCommentAct } from "../acts/add-user-profile-comment.act";

type AddCommentWidgetContainerProps = {
	onClose(): void;
};

const limits = {
	content: {
		min: 10,
		max: 250,
	},
} as const;

const AddCommentWidgetContainer = ({
	onClose,
}: AddCommentWidgetContainerProps) => {
	const [{ invalid, values, untouched }, { inject }] =
		useForm<AddUserProfileCommentFormValues>(
			{
				comment: "",
			},
			{
				comment: [minLength(limits.content.min), maxLength(limits.content.max)],
			},
		);

	const confirmCommentAdd = async () => {
		const result = await addUserProfileCommentAct(values);
	};

	return (
		<Modal2 onClose={onClose}>
			<Modal2.Header
				title="Add Comment"
				closeButtonTitle="Close comment adding"
			/>
			<Modal2.Body>
				<p className="mb-4">
					Please be aware that comments are <strong>public</strong> and{" "}
					<strong>can be seen by anyone</strong>. You can always delete your
					comment later.
				</p>
				<Field
					label={
						values.comment.length === 0
							? `Comment*`
							: `Comment (${values.comment.length}/${limits.content.max})*`
					}
				>
					<Textarea
						placeholder="Write your comment here... Be polite and respectful"
						{...inject(`comment`)}
					/>
				</Field>
			</Modal2.Body>
			<Modal2.Footer>
				<Button
					className="ml-auto"
					i={2}
					s={2}
					auto
					disabled={invalid || untouched}
					title="Confirm comment add"
					onClick={confirmCommentAdd}
				>
					Confirm
				</Button>
			</Modal2.Footer>
		</Modal2>
	);
};

export { AddCommentWidgetContainer };
