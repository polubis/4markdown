import { reloadYourDocuments } from "actions/reload-your-documents.action";
import ErrorModal from "components/error-modal";
import { Button } from "design-system/button";
import React from "react";
import {
	docManagementStoreActions,
	docManagementStoreSelectors,
} from "store/doc-management/doc-management.store";

const CreatorErrorModalContainer = () => {
	const docManagementStore = docManagementStoreSelectors.useFail();

	return (
		<ErrorModal
			heading="Ups, something went wrong"
			message={docManagementStore.error.message}
			footer={
				docManagementStore.error.symbol === `out-of-date` && (
					<Button
						type="button"
						i={2}
						s={2}
						auto
						title="Sync out of date document"
						onClick={reloadYourDocuments}
					>
						Sync
					</Button>
				)
			}
			onClose={docManagementStoreActions.idle}
		/>
	);
};

export default CreatorErrorModalContainer;
