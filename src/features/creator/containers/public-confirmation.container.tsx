import { updateDocumentVisibility } from "actions/update-document-visibility.action";
import { Button } from "design-system/button";
import React, { type FormEventHandler } from "react";
import { BiX } from "react-icons/bi";
import { useDocManagementStore } from "store/doc-management/doc-management.store";
import { meta } from "../../../../meta";

interface PublicConfirmationContainerProps {
	onClose(): void;
	onCancel(): void;
	onConfirm(): void;
}

const PublicConfirmationContainer = ({
	onClose,
	onCancel,
	onConfirm,
}: PublicConfirmationContainerProps) => {
	const docManagementStore = useDocManagementStore();

	const handleConfirm: FormEventHandler<HTMLFormElement> = async (
		e,
	): Promise<void> => {
		e.preventDefault();

		try {
			await updateDocumentVisibility({ visibility: `public` });

			onConfirm();
		} catch {}
	};

	return (
		<form className="flex flex-col" onSubmit={handleConfirm}>
			<header className="flex items-center">
				<h6 className="text-xl mr-4 capitalize">Make it public</h6>
				<Button
					i={2}
					s={1}
					className="ml-auto"
					disabled={docManagementStore.is === `busy`}
					title="Close public document confirmation"
					onClick={onClose}
				>
					<BiX />
				</Button>
			</header>
			<p className="mt-4 mb-1">
				You can share this document using a <strong>unique link</strong>. Public
				documents are not visible on Google or in the{` `}
				<a
					className="underline underline-offset-2 text-blue-800 dark:text-blue-500 font-bold"
					href={meta.routes.education.zone}
					target="_blank"
					rel="noreferrer"
				>
					Education Zone
				</a>
				.
			</p>
			<p>
				<i>
					Public means the document is visible <strong>to you</strong> and
					anyone with the <strong>link</strong> you share.
				</i>
			</p>
			<footer className="mt-6 flex">
				<Button
					className="ml-auto"
					type="button"
					i={1}
					s={2}
					auto
					title="Cancel public document confirmation"
					disabled={docManagementStore.is === `busy`}
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
					disabled={docManagementStore.is === `busy`}
					title="Confirm public document status change"
				>
					Confirm
				</Button>
			</footer>
		</form>
	);
};

export { PublicConfirmationContainer };
