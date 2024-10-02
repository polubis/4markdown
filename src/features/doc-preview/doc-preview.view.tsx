import { DocumentLayout } from 'components/document-layout';
import LoadingScreen from 'components/loading-screen';
import React from 'react';
import { useAuthStore } from 'store/auth/auth.store';

import { BackToCreatorLinkContainer } from 'containers/back-to-creator-link.container';
import { DocsBrowseLinkContainer } from 'containers/docs-browse-link.container';
import { AppNavigation } from 'components/app-navigation';
import { AppFooterContainer } from 'containers/app-footer.container';
import { useDocumentRateUpdate } from 'core/use-document-rate-update';
import { DocumentRatingStatic } from 'components/document-rating-static';
import { DocumentRatingContainer } from 'containers/document-rating.container';
import {
  docPreviewStoreActions,
  docPreviewStoreSelectors,
} from './doc-preview.store';

const ErrorScreen = React.lazy(() => import(`../../components/error-screen`));

const useDocLoad = () => {
  React.useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    docPreviewStoreActions.load({ id: searchParams.get(`id`) ?? `` });
  }, []);
};

const DocumentContent = () => {
  const docPreviewStore = docPreviewStoreSelectors.useOk();
  const { rating, updateRating } = useDocumentRateUpdate(docPreviewStore.doc);

  return (
    <DocumentLayout
      tags={
        docPreviewStore.doc.visibility === `permanent`
          ? docPreviewStore.doc.tags
          : []
      }
      author={docPreviewStore.doc.author}
      ratingTop={<DocumentRatingStatic rating={rating} />}
      ratingBottom={<DocumentRatingContainer onChange={updateRating} />}
    >
      {docPreviewStore.doc.code}
    </DocumentLayout>
  );
};

const DocPreviewView = () => {
  useDocLoad();

  const docPreviewStore = docPreviewStoreSelectors.useState();

  return (
    <>
      <AppNavigation>
        <BackToCreatorLinkContainer />
        <DocsBrowseLinkContainer />
      </AppNavigation>
      {(docPreviewStore.is === `idle` || docPreviewStore.is === `busy`) && (
        <LoadingScreen />
      )}
      {docPreviewStore.is === `fail` && (
        <React.Suspense fallback={<LoadingScreen />}>
          <ErrorScreen />
        </React.Suspense>
      )}
      {docPreviewStore.is === `ok` && <DocumentContent />}
      <AppFooterContainer />
    </>
  );
};

export default DocPreviewView;
