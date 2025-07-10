import { API4MarkdownPayload } from "api-4markdown-contracts";
import { Button } from "design-system/button";
import { Field } from "design-system/field";
import { Modal2 } from "design-system/modal2";
import { Textarea } from "design-system/textarea";
import { maxLength, minLength } from "development-kit/form";
import { useForm } from "development-kit/use-form";
import React from "react";
import { AddUserProfileCommentFormValues } from "../models";
import { BiErrorAlt } from "react-icons/bi";
import { Transaction } from "development-kit/utility-types";
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
	const [state, setState] = React.useState<Transaction>({ is: `idle` });

	const [{ invalid, values, untouched }, { inject }] =
		useForm<AddUserProfileCommentFormValues>(
			{
				content: "",
			},
			{
				content: [minLength(limits.content.min), maxLength(limits.content.max)],
			},
		);

	const confirmAdd = async () => {
		setState({ is: "busy" });

		const result = await addUserProfileCommentAct(values);

		if (result.is === `ok`) {
			onClose();
			return;
		}

		setState(result);
	};

	return (
		<Modal2 onClose={onClose} disabled={state.is === `busy`}>
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
						values.content.length === 0
							? `Comment*`
							: `Comment (${values.content.length}/${limits.content.max})*`
					}
				>
					<Textarea
						placeholder="Write your comment here... Be polite and respectful"
						{...inject(`content`)}
					/>
				</Field>
				{state.is === "fail" && (
					<p className="mt-4 flex gap-2 text-sm justify-center mb-4 items-center bg-red-300 dark:bg-red-700 p-2 rounded-md">
						<BiErrorAlt className="shrink-0" size={20} />
						{state.error.message}
					</p>
				)}
			</Modal2.Body>
			<Modal2.Footer>
				<Button
					className="ml-auto"
					i={2}
					s={2}
					auto
					disabled={invalid || untouched || state.is === `busy`}
					title="Confirm comment add"
					onClick={confirmAdd}
				>
					Confirm
				</Button>
			</Modal2.Footer>
		</Modal2>
	);
};

export { AddCommentWidgetContainer };
