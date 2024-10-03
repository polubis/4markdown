import { DocumentLayout } from 'components/document-layout';
import LoadingScreen from 'components/loading-screen';
import React from 'react';

import { BackToCreatorLinkContainer } from 'containers/back-to-creator-link.container';
import { DocsBrowseLinkContainer } from 'containers/docs-browse-link.container';
import { AppNavigation } from 'components/app-navigation';
import { AppFooterContainer } from 'containers/app-footer.container';
import { useDocumentRateUpdate } from 'core/use-document-rate-update';
import {
  loadDocument,
  useDocumentPreviewStore,
} from './store/document-preview.store';
import { selectSafe } from './store/document-preview.selectors';

const ErrorScreen = React.lazy(() =>
  import(`./components/error-screen`).then(({ ErrorScreen }) => ({
    default: ErrorScreen,
  })),
);

const DocumentContent = () => {
  const documentPreviewStore = useDocumentPreviewStore(selectSafe);
  const { rating, yourRate, updateRating } = useDocumentRateUpdate(
    documentPreviewStore.document,
  );

  return (
    <DocumentLayout
      rating={rating}
      onRate={updateRating}
      yourRate={yourRate}
      tags={
        documentPreviewStore.document.visibility === `permanent`
          ? documentPreviewStore.document.tags
          : []
      }
      author={documentPreviewStore.document.author}
    >
      {documentPreviewStore.document.code}
    </DocumentLayout>
  );
};

const DocumentPreviewView = () => {
  const documentPreviewStore = useDocumentPreviewStore();

  React.useEffect(() => {
    loadDocument();
  }, []);

  return (
    <>
      <AppNavigation>
        <BackToCreatorLinkContainer />
        <DocsBrowseLinkContainer />
      </AppNavigation>
      {(documentPreviewStore.is === `idle` ||
        documentPreviewStore.is === `busy`) && <LoadingScreen />}
      {documentPreviewStore.is === `fail` && (
        <React.Suspense fallback={<LoadingScreen />}>
          <ErrorScreen />
        </React.Suspense>
      )}
      {documentPreviewStore.is === `ok` && <DocumentContent />}
      <AppFooterContainer />
    </>
  );
};

export { DocumentPreviewView };
