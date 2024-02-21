import LoadingScreen from 'components/loading-screen';
import Markdown from 'components/markdown';
import { Badge } from 'design-system/badge';
import { Badges } from 'design-system/badges';
import { Button } from 'design-system/button';
import Modal from 'design-system/modal';
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
        <Modal>
          Sorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with
          the release of Letraset sheets containing Lorem Ipsum passages, and
          more recently with desktop publishing software like Aldus PageMaker
          including versions of Lorem Ipsum. orem Ipsum is simply dummy text of
          the printing and typesetting industry. Lorem Ipsum has been the
          industry's standard dummy text ever since the 1500s, when an unknown
          printer took a galley of type and scrambled it to make a type specimen
          book. It has survived not only five centuries, but also the leap into
          electronic typesetting, remaining essentially unchanged. It was
          popularised in the 1960s with the release of Letraset sheets
          containing Lorem Ipsum passages, and more recently with desktop
          publishing software like Aldus PageMaker including versions of Lorem
          Ipsum. orem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with
          the release of Letraset sheets containing Lorem Ipsum passages, and
          more recently with desktop publishing software like Aldus PageMaker
          including versions of Lorem Ipsum. orem Ipsum is simply dummy text of
          the printing and typesetting industry. Lorem Ipsum has been the
          industry's standard dummy text ever since the 1500s, when an unknown
          printer took a galley of type and scrambled it to make a type specimen
          book. It has survived not only five centuries, but also the leap into
          electronic typesetting, remaining essentially unchanged. It was
          popularised in the 1960s with the release of Letraset sheets
          containing Lorem Ipsum passages, and more recently with desktop
          publishing software like Aldus PageMaker including versions of Lorem
          Ipsum. orem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with
          the release of Letraset sheets containing Lorem Ipsum passages, and
          more recently with desktop publishing software like Aldus PageMaker
          including versions of Lorem Ipsum. orem Ipsum is simply dummy text of
          the printing and typesetting industry. Lorem Ipsum has been the
          industry's standard dummy text ever since the 1500s, when an unknown
          printer took a galley of type and scrambled it to make a type specimen
          book. It has survived not only five centuries, but also the leap into
          electronic typesetting, remaining essentially unchanged. It was
          popularised in the 1960s with the release of Letraset sheets
          containing Lorem Ipsum passages, and more recently with desktop
          publishing software like Aldus PageMaker including versions of Lorem
          Ipsum. orem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with
          the release of Letraset sheets containing Lorem Ipsum passages, and
          more recently with desktop publishing software like Aldus PageMaker
          including versions of Lorem Ipsum.
        </Modal>
      </main>
    </>
  );
};

export default DocPreviewView;
