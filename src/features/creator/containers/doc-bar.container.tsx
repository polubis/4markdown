import { Bar } from 'design-system/bar';
import React from 'react';
import { useDocStore } from 'store/doc/doc.store';
import { useAuthStore } from 'store/auth/auth.store';
import { DocBarRow } from '../components/doc-bar-row';
import { YourDocumentsContainer } from './your-documents.container';
import { getYourDocuments } from 'actions/get-your-documents.action';

const ActiveDocumentBarContainer = React.lazy(
  () => import(`./active-document-bar.container`),
);

const DocBarLoader = () => (
  <div className="flex gap-2">
    <div className="w-20 h-8 rounded-md bg-gray-300 dark:bg-gray-800" />
    <div className="w-4 h-8 rounded-md bg-gray-300 dark:bg-gray-800" />
    <div className="w-10 h-8 rounded-md bg-gray-300 dark:bg-gray-800" />
  </div>
);

const DocBarContainer = () => {
  const docStore = useDocStore();
  const authStore = useAuthStore();

  React.useEffect(() => {
    authStore.is === `authorized` && getYourDocuments();
  }, [authStore]);

  return (
    <Bar className="h-[50px]">
      {authStore.is === `idle` && <DocBarLoader />}
      {authStore.is === `authorized` && (
        <>
          {docStore.is === `idle` ? (
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
