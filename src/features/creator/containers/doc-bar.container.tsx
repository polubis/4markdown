import React from "react";
import { useDocStore } from "store/doc/doc.store";
import { useAuthStore } from "store/auth/auth.store";
import { YourDocumentsContainer } from "./your-documents.container";
import { getYourDocuments } from "actions/get-your-documents.action";

const ActiveDocumentBarContainer = React.lazy(
	() => import(`./active-document-bar.container`),
);

const DocBarLoader = () => (
	<div className="flex gap-2">
		<div className="w-20 h-8 rounded-md bg-gray-300 dark:bg-gray-800" />
		<div className="w-4 h-8 rounded-md bg-gray-300 dark:bg-gray-800" />
		<div className="w-10 h-8 rounded-md bg-gray-300 dark:bg-gray-800" />
	</div>
);

const DocBarContainer = () => {
	const docStore = useDocStore();
	const authStore = useAuthStore();

	React.useEffect(() => {
		authStore.is === `authorized` && getYourDocuments();
	}, [authStore]);

	return (
		<>
			{authStore.is === `idle` && <DocBarLoader />}
			{authStore.is === `authorized` && (
				<>
					{docStore.is === `idle` ? (
						<>
							<h6
								className="font-bold text-lg max-w-[260px] truncate mr-4"
								title="Markdown Editor"
							>
								Markdown Editor
							</h6>
							<div className="flex items-center gap-2">
								<YourDocumentsContainer />
							</div>
						</>
					) : (
						<React.Suspense fallback={<DocBarLoader />}>
							<ActiveDocumentBarContainer />
						</React.Suspense>
					)}
				</>
			)}
			{authStore.is === `unauthorized` && (
				<h6 className="font-bold text-lg truncate mr-4" title="Markdown Editor">
					Markdown Editor
				</h6>
			)}
		</>
	);
};

export { DocBarContainer };
