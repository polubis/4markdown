import { Bar } from 'design-system/bar';
import React from 'react';
import { useDocStore } from 'store/doc/doc.store';
import { useAuthStore } from 'store/auth/auth.store';
import { DocBarRow } from '../components/doc-bar-row';
import { DocBarLoader } from '../components/doc-bar-loader';
import { YourDocumentsContainer } from './your-documents.container';

const ActiveDocBarContainer = React.lazy(
  () => import(`./active-doc-bar.container`),
);

const DocBarContainer = () => {
  const docStore = useDocStore();
  const authStore = useAuthStore();

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
              <ActiveDocBarContainer />
            </React.Suspense>
          )}
        </>
      )}
      {authStore.is === `unauthorized` && <DocBarRow title="Markdown Editor" />}
    </Bar>
  );
};

export { DocBarContainer };
