import { Bar } from 'design-system/bar';
import React from 'react';
import { useDocStore } from 'store/doc/doc.store';
import { useAuthStore } from 'store/auth/auth.store';
import { Button } from 'design-system/button';
import { BiEdit, BiGridAlt, BiSave } from 'react-icons/bi';
import { useDocsStore } from 'store/docs/docs.store';
import { DocBarRow } from '../../../components/doc-bar-row';
import { DocBarLoader } from '../../../components/doc-bar-loader';

const ActiveDocBarContent = React.lazy(
  () => import(`../../../components/active-doc-bar-content`),
);

const DocBarContainer = () => {
  const docStore = useDocStore();
  const docsStore = useDocsStore();
  const authStore = useAuthStore();

  const disabled = docsStore.is === `busy`;

  return (
    <Bar className="h-[50px]">
      {authStore.is === `idle` && <DocBarLoader />}
      {authStore.is === `authorized` && (
        <>
          {docStore.is === `idle` ? (
            <DocBarRow title="Type Your Document Name Here">
              <Button
                i={1}
                s={1}
                title="Change document name"
                disabled={disabled}
                // onClick={handleEditOpen}
              >
                <BiEdit />
              </Button>
              <Button
                i={1}
                s={1}
                disabled={disabled}
                title="Save changes"
                // onClick={handleSaveCodeConfirm}
              >
                <BiSave />
              </Button>
              <Button
                i={1}
                s={1}
                title="Your documents"
                disabled={disabled}
                // onClick={docsModal.open}
              >
                <BiGridAlt />
              </Button>
            </DocBarRow>
          ) : (
            <React.Suspense fallback={<DocBarLoader />}>
              <ActiveDocBarContent />
            </React.Suspense>
          )}
        </>
      )}
      {authStore.is === `unauthorized` && (
        <DocBarRow title="Markdown Cheatsheet" />
      )}
    </Bar>
  );
};

export default DocBarContainer;
