import { useSimpleFeature } from "@greenonsoftware/react-kit";
import { Button } from "design-system/button";
import React, { type FormEventHandler } from "react";
import { BiX } from "react-icons/bi";
import { useDocManagementStore } from "store/doc-management/doc-management.store";
import { meta } from "../../../../meta";
import { PermamentDocFormContainer } from "./permament-doc-form.container";

interface PermanentConfirmationContainerProps {
	onConfirm(): void;
	onCancel(): void;
	onClose(): void;
}

const PermanentConfirmationContainer = ({
	onConfirm,
	onCancel,
	onClose,
}: PermanentConfirmationContainerProps) => {
	const docManagementStore = useDocManagementStore();
	const formSection = useSimpleFeature();

	const openFormSection: FormEventHandler<HTMLFormElement> = async (
		e,
	): Promise<void> => {
		e.preventDefault();
		formSection.on();
	};

	if (formSection.isOn) {
		return (
			<PermamentDocFormContainer
				onClose={onClose}
				onConfirm={onConfirm}
				onBack={formSection.off}
			/>
		);
	}

	return (
		<form className="flex flex-col" onSubmit={openFormSection}>
			<header className="flex items-center">
				<h6 className="text-xl mr-4 capitalize">Make it permanent</h6>
				<Button
					i={2}
					s={1}
					className="ml-auto"
					disabled={docManagementStore.is === `busy`}
					title="Close document permanent status confirmation"
					onClick={onClose}
				>
					<BiX />
				</Button>
			</header>
			<p className="mt-4 mb-1">
				Setting visibility to <strong>permanent</strong> makes your document
				available on <strong>Google</strong> with a static URL based on its
				name.
			</p>
			<p className="mb-1">
				You can change the document status later, but indexing or removal from
				{` `}
				Google may take <strong>1-14 days</strong>.
			</p>
			<p>
				<i>
					To add your article in the{` `}
					<a
						className="underline underline-offset-2 text-blue-800 dark:text-blue-500 font-bold"
						href={meta.routes.education.zone}
						target="_blank"
						rel="noreferrer"
					>
						Education Zone
					</a>
					, contact us via{` `}
					<a
						className="underline underline-offset-2 text-blue-800 dark:text-blue-500 font-bold"
						href={meta.linkedInUrl}
						target="_blank"
						rel="noreferrer"
					>
						LinkedIn
					</a>
					. Not all permanent documents are displayed to maintain quality
				</i>
			</p>
			<footer className="mt-6 flex">
				<Button
					className="ml-auto"
					type="button"
					i={1}
					s={2}
					auto
					title="Cancel document permanent status confirmation"
					onClick={onCancel}
				>
					Cancel
				</Button>
				<Button
					type="submit"
					className="ml-2"
					i={2}
					s={2}
					auto
					title="Confirm permanent document policy"
				>
					Confirm
				</Button>
			</footer>
		</form>
	);
};

export { PermanentConfirmationContainer };
