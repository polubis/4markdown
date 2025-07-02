import React from "react";
import { Button } from "design-system/button";
import { useDocManagementStore } from "store/doc-management/doc-management.store";
import { useDocsStore } from "store/docs/docs.store";
import { BiCollection } from "react-icons/bi";
import { useSimpleFeature } from "@greenonsoftware/react-kit";

const DocsListModal = React.lazy(
	() => import(`../../../components/docs-list-modal`),
);

const YourDocumentsContainer = () => {
	const docManagementStore = useDocManagementStore();
	const docsStore = useDocsStore();
	const modal = useSimpleFeature();

	return (
		<>
			<Button
				i={1}
				s={1}
				disabled={docManagementStore.is === `busy` || docsStore.is === `busy`}
				title="Your documents"
				onClick={modal.on}
			>
				<BiCollection className="rotate-180" />
			</Button>

			{modal.isOn && (
				<React.Suspense>
					<DocsListModal onClose={modal.off} />
				</React.Suspense>
			)}
		</>
	);
};

export { YourDocumentsContainer };
