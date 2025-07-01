import { AppNavigation } from "components/app-navigation";
import LoadingScreen from "components/loading-screen";
import { AppFooterContainer } from "containers/app-footer.container";
import { CreationLinkContainer } from "containers/creation-link.container";
import { DocumentLayoutContainer } from "containers/document-layout.container";
import { EducationRankLinkContainer } from "containers/education-rank-link.container";
import { EducationZoneLinkContainer } from "containers/education-zone-link.container";
import { DocumentLayoutProvider } from "providers/document-layout.provider";
import React from "react";
import { useDocumentPreviewStore } from "./store/document-preview.store";
import { loadDocument } from "./store/load-document.action";

const ErrorScreen = React.lazy(() =>
	import(`./components/error-screen`).then(({ ErrorScreen }) => ({
		default: ErrorScreen,
	})),
);

const DocumentPreviewView = () => {
	const documentPreviewStore = useDocumentPreviewStore();

	React.useEffect(() => {
		loadDocument();
	}, []);

	return (
		<>
			<AppNavigation>
				<CreationLinkContainer />
				<EducationRankLinkContainer />
				<EducationZoneLinkContainer />
			</AppNavigation>
			{(documentPreviewStore.is === `idle` ||
				documentPreviewStore.is === `busy`) && <LoadingScreen />}
			{documentPreviewStore.is === `fail` && (
				<React.Suspense fallback={<LoadingScreen />}>
					<ErrorScreen />
				</React.Suspense>
			)}
			{documentPreviewStore.is === `ok` && (
				<DocumentLayoutProvider document={documentPreviewStore.document}>
					<DocumentLayoutContainer />
				</DocumentLayoutProvider>
			)}
			<AppFooterContainer />
		</>
	);
};

export { DocumentPreviewView };
