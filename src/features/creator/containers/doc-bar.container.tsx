import { Bar } from 'design-system/bar';
import React from 'react';
import { useAuthStore } from 'store/auth/auth.store';
import { DocBarRow } from '../components/doc-bar-row';
import { DocBarLoader } from '../components/doc-bar-loader';
import { YourDocumentsContainer } from './your-documents.container';
import { useDocumentsCreatorState } from 'store/documents-creator';
import { getYourDocumentsAct } from 'acts/get-your-documents.act';

const ActiveDocumentBarContainer = React.lazy(
  () => import(`./active-document-bar.container`),
);

const DocBarContainer = () => {
  const { activeDocumentId } = useDocumentsCreatorState();
  const authStore = useAuthStore();

  React.useEffect(() => {
    authStore.is === `authorized` && getYourDocumentsAct();
  }, [authStore]);

  return (
    <Bar className="h-[50px]">
      {authStore.is === `idle` && <DocBarLoader />}
      {authStore.is === `authorized` && (
        <>
          {activeDocumentId === null ? (
            <DocBarRow title="Markdown Editor">
              <YourDocumentsContainer />
            </DocBarRow>
          ) : (
            <React.Suspense fallback={<DocBarLoader />}>
              <ActiveDocumentBarContainer />
            </React.Suspense>
          )}
        </>
      )}
      {authStore.is === `unauthorized` && <DocBarRow title="Markdown Editor" />}
    </Bar>
  );
};

export { DocBarContainer };
