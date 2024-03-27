import { AppNav } from 'components/app-nav';
import LoadingScreen from 'components/loading-screen';
import Markdown from 'components/markdown';
import { Badge } from 'design-system/badge';
import { Badges } from 'design-system/badges';
import { Button } from 'design-system/button';
import { navigate } from 'gatsby';
import React from 'react';
import { BiArrowToLeft } from 'react-icons/bi';
import { useAuthStore } from 'store/auth/auth.store';
import {
  docPreviewStoreActions,
  useDocPreviewStore,
} from 'store/doc-preview/doc-preview.store';
import { siteMetadataStoreSelectors } from 'store/site-metadata/site-metadata.store';

const ErrorScreen = React.lazy(() => import(`../../components/error-screen`));

const DocPreviewView = () => {
  const siteMetadataStore = siteMetadataStoreSelectors.useReady();

  const docPreviewStore = useDocPreviewStore();
  const authStore = useAuthStore();

  React.useEffect(() => {
    if (authStore.is === `authorized` || authStore.is === `unauthorized`) {
      const searchParams = new URLSearchParams(window.location.search);
      docPreviewStoreActions.load({ id: searchParams.get(`id`) ?? `` });
    }
  }, [authStore]);

  if (docPreviewStore.is === `idle` || docPreviewStore.is === `busy`) {
    return <LoadingScreen />;
  }

  if (docPreviewStore.is === `fail`) {
    return (
      <React.Suspense fallback={<LoadingScreen />}>
        <ErrorScreen />
      </React.Suspense>
    );
  }

  return (
    <>
      <AppNav>Siema</AppNav>
      <header className="p-4">
        <nav>
          <Button
            type="button"
            i={2}
            s={2}
            title="Go back to editor"
            onClick={() => navigate(siteMetadataStore.routes.home)}
          >
            <BiArrowToLeft />
          </Button>
        </nav>
      </header>
      <main className="max-w-xl p-4 mx-auto">
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
  );
};

export default DocPreviewView;
