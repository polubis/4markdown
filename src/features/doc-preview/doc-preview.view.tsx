import { AppNav } from 'components/app-nav';
import LoadingScreen from 'components/loading-screen';
import Markdown from 'components/markdown';
import { Badge } from 'design-system/badge';
import { Badges } from 'design-system/badges';
import { Link } from 'gatsby';
import React from 'react';
import { BiArrowBack } from 'react-icons/bi';
import { useAuthStore } from 'store/auth/auth.store';
import {
  docPreviewStoreActions,
  useDocPreviewStore,
} from 'store/doc-preview/doc-preview.store';

const ErrorScreen = React.lazy(() => import(`../../components/error-screen`));

const useDocLoad = () => {
  const authStore = useAuthStore();

  React.useEffect(() => {
    if (authStore.is !== `idle`) {
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
      <AppNav>
        <Link to="/" className="flex items-center ml-2">
          <BiArrowBack className="mr-2" />
          <span className="text-md font-semibold">Back to Creator</span>
        </Link>
      </AppNav>
      {(docPreviewStore.is === `idle` || docPreviewStore.is === `busy`) && (
        <LoadingScreen />
      )}
      {docPreviewStore.is === `fail` && (
        <React.Suspense fallback={<LoadingScreen />}>
          <ErrorScreen />
        </React.Suspense>
      )}
      {docPreviewStore.is === `ok` && (
        <>
          <main className="max-w-4xl p-4 mx-auto">
            {docPreviewStore.doc.visibility === `permanent` &&
              docPreviewStore.doc.tags.length > 0 && (
                <Badges className="mb-4">
                  {docPreviewStore.doc.tags.map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </Badges>
              )}

            <Markdown>{docPreviewStore.doc.code}</Markdown>
          </main>
        </>
      )}
    </>
  );
};

export default DocPreviewView;
