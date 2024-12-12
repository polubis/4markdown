import { DocumentLayout } from 'components/document-layout';
import LoadingScreen from 'components/loading-screen';
import React from 'react';

import { EducationZoneLinkContainer } from 'containers/education-zone-link.container';
import { AppNavigation } from 'components/app-navigation';
import { AppFooterContainer } from 'containers/app-footer.container';
import { useDocumentPreviewStore } from './store/document-preview.store';
import { CreationLinkContainer } from 'containers/creation-link.container';
import { loadDocument } from './store/load-document.action';
import { EducationRankLinkContainer } from 'containers/education-rank-link.container';
import { DocumentLayoutProvider } from 'components/document-layout.provider';

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
          <DocumentLayout />
        </DocumentLayoutProvider>
      )}
      <AppFooterContainer />
    </>
  );
};

export { DocumentPreviewView };
