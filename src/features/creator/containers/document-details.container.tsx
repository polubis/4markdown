import { useSimpleFeature } from "@greenonsoftware/react-kit";
import c from "classnames";
import { formatDistance } from "date-fns";
import { Button } from "design-system/button";
import { Modal } from "design-system/modal";
import { Tabs } from "design-system/tabs";
import { PermanentConfirmationContainer } from "features/creator/containers/permanent-confirmation.container";
import { PrivateConfirmationContainer } from "features/creator/containers/private-confirmation.container";
import { PublicConfirmationContainer } from "features/creator/containers/public-confirmation.container";
import { navigate } from "gatsby";
import React from "react";
import { BiPencil, BiTrash } from "react-icons/bi";
import { docStoreSelectors } from "store/doc/doc.store";
import { useDocManagementStore } from "store/doc-management/doc-management.store";
import { meta } from "../../../../meta";
import { PermamentDocFormContainer } from "./permament-doc-form.container";

interface DocumentDetailsContainerProps {
	onClose(): void;
	onOpen(): void;
}

const DocumentDetailsContainer = ({
	onClose,
	onOpen,
}: DocumentDetailsContainerProps) => {
	const privateConfirmation = useSimpleFeature();
	const permanentConfirmation = useSimpleFeature();
	const publicConfirmation = useSimpleFeature();
	const docStore = docStoreSelectors.useActive();
	const docManagementStore = useDocManagementStore();
	const permamentDocumentEdition = useSimpleFeature();

	return (
		<Modal disabled={docManagementStore.is === `busy`} onClose={onClose}>
			{permamentDocumentEdition.isOn && (
				<PermamentDocFormContainer
					onBack={permamentDocumentEdition.off}
					onConfirm={permamentDocumentEdition.off}
					onClose={onClose}
				/>
			)}

			{privateConfirmation.isOn && (
				<PrivateConfirmationContainer
					onConfirm={privateConfirmation.off}
					onCancel={privateConfirmation.off}
					onClose={onClose}
				/>
			)}

			{permanentConfirmation.isOn && (
				<PermanentConfirmationContainer
					onConfirm={permanentConfirmation.off}
					onCancel={permanentConfirmation.off}
					onClose={onClose}
				/>
			)}

			{publicConfirmation.isOn && (
				<PublicConfirmationContainer
					onConfirm={publicConfirmation.off}
					onCancel={publicConfirmation.off}
					onClose={onClose}
				/>
			)}

			{permanentConfirmation.isOff &&
				publicConfirmation.isOff &&
				privateConfirmation.isOff &&
				permamentDocumentEdition.isOff && (
					<>
						<Modal.Header
							title="Details"
							closeButtonTitle="Close additional options"
						>
							<Button
								i={2}
								s={1}
								disabled={docManagementStore.is === `busy`}
								title="Delete current document"
								onClick={onOpen}
							>
								<BiTrash />
							</Button>
							{docStore.visibility === `permanent` && (
								<Button
									i={2}
									s={1}
									disabled={docManagementStore.is === `busy`}
									title="Edit current document"
									onClick={permamentDocumentEdition.on}
								>
									<BiPencil />
								</Button>
							)}
						</Modal.Header>
						<p>
							Name: <strong>{docStore.name}</strong>
						</p>
						{docStore.visibility === `permanent` && (
							<>
								<p className="mt-1">
									Description:{` `}
									<strong className="break-words">
										{docStore.description}
									</strong>
								</p>
								<p className="mt-1">
									Tags:{` `}
									<strong className="break-words">
										{docStore.tags.join(`, `)}
									</strong>
								</p>
							</>
						)}
						<p className="mt-1">
							Visibility:{` `}
							<strong
								className={c(
									`capitalize`,
									{
										"text-green-700 dark:text-green-600":
											docStore.visibility === `public` ||
											docStore.visibility === `permanent`,
									},
									{
										"text-gray-600 dark:text-gray-400":
											docStore.visibility === `private`,
									},
								)}
							>
								{docStore.visibility}
							</strong>
						</p>
						<p className="mt-1">
							Created:{` `}
							<strong>
								{formatDistance(new Date().toISOString(), docStore.cdate)} ago
							</strong>
						</p>
						<p className="mt-1">
							Edited:{` `}
							<strong>
								{formatDistance(new Date().toISOString(), docStore.mdate)} ago
							</strong>
						</p>
						{(docStore.visibility === `public` ||
							docStore.visibility === `permanent`) && (
							<button
								className="underline underline-offset-2 text-blue-800 dark:text-blue-500 mt-1"
								title="Document preview"
								onClick={() =>
									navigate(`${meta.routes.documents.preview}?id=${docStore.id}`)
								}
							>
								<strong>Preview</strong>
							</button>
						)}
						{docStore.visibility === `permanent` && (
							<button
								className="underline underline-offset-2 text-blue-800 dark:text-blue-500 ml-3"
								title="Document URL"
								onClick={() => navigate(docStore.path)}
							>
								<strong>URL</strong>
							</button>
						)}
						<Tabs className="mt-8">
							<Tabs.Item
								title="Make this document private"
								active={docStore.visibility === `private`}
								onClick={
									docStore.visibility === `private`
										? undefined
										: privateConfirmation.on
								}
								disabled={docManagementStore.is === `busy`}
							>
								Private
							</Tabs.Item>
							<Tabs.Item
								title="Make this document public"
								active={docStore.visibility === `public`}
								onClick={
									docStore.visibility === `public`
										? undefined
										: publicConfirmation.on
								}
								disabled={docManagementStore.is === `busy`}
							>
								Public
							</Tabs.Item>
							<Tabs.Item
								title="Make this document permanent"
								active={docStore.visibility === `permanent`}
								onClick={
									docStore.visibility === `permanent`
										? undefined
										: permanentConfirmation.on
								}
								disabled={docManagementStore.is === `busy`}
							>
								Permanent
							</Tabs.Item>
						</Tabs>
					</>
				)}
		</Modal>
	);
};

export default DocumentDetailsContainer;
