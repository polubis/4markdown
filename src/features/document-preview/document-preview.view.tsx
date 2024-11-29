import { DocumentLayout } from 'components/document-layout';
import LoadingScreen from 'components/loading-screen';
import React from 'react';

import { EducationZoneLinkContainer } from 'containers/education-zone-link.container';
import { AppNavigation } from 'components/app-navigation';
import { AppFooterContainer } from 'containers/app-footer.container';
import { useDocumentRateUpdate } from 'core/use-document-rate-update';
import { useDocumentPreviewStore } from './store/document-preview.store';
import { selectSafe } from './store/document-preview.selectors';
import { CreationLinkContainer } from 'containers/creation-link.container';
import { loadDocument } from './store/load-document.action';
import { EducationRankLinkContainer } from 'containers/education-rank-link.container';

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
      {documentPreviewStore.is === `ok` && <DocumentContent />}
      <AppFooterContainer />
    </>
  );
};

export { DocumentPreviewView };
