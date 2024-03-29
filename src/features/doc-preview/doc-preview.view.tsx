import { AppNavContainer } from 'containers/app-nav.container';
import { DocumentLayout } from 'components/document-layout';
import LoadingScreen from 'components/loading-screen';
import React from 'react';
import { useAuthStore } from 'store/auth/auth.store';
import {
  docPreviewStoreActions,
  useDocPreviewStore,
} from 'store/doc-preview/doc-preview.store';
import { BackToCreatorLinkContainer } from 'containers/back-to-creator-link.container';

const ErrorScreen = React.lazy(() => import(`../../components/error-screen`));

const useDocLoad = () => {
  const authStore = useAuthStore();

  React.useEffect(() => {
    if (authStore.is === `authorized` || authStore.is === `unauthorized`) {
      const searchParams = new URLSearchParams(window.location.search);
      docPreviewStoreActions.load({ id: searchParams.get(`id`) ?? `` });
    }
  }, [authStore]);
};

const DocPreviewView = () => {
  useDocLoad();

  const docPreviewStore = useDocPreviewStore();

  return (
    <>
      <AppNavContainer>
        <BackToCreatorLinkContainer />
      </AppNavContainer>
      {(docPreviewStore.is === `idle` || docPreviewStore.is === `busy`) && (
        <LoadingScreen />
      )}
      {docPreviewStore.is === `fail` && (
        <React.Suspense fallback={<LoadingScreen />}>
          <ErrorScreen />
        </React.Suspense>
      )}
      {docPreviewStore.is === `ok` && (
        <DocumentLayout
          tags={
            docPreviewStore.doc.visibility === `permanent`
              ? docPreviewStore.doc.tags
              : []
          }
        >
          {docPreviewStore.doc.code}
        </DocumentLayout>
      )}
    </>
  );
};

export default DocPreviewView;
