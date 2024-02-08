import React from 'react';
import { Button } from 'design-system/button';
import { useDocManagementStore } from 'store/doc-management/doc-management.store';
import { useDocsStore } from 'store/docs/docs.store';
import { BiGridAlt } from 'react-icons/bi';
import { useToggle } from 'development-kit/use-toggle';

const DocsListModal = React.lazy(
  () => import(`../../../components/docs-list-modal`),
);

const YourDocumentsContainer = () => {
  const docManagementStore = useDocManagementStore();
  const docsStore = useDocsStore();
  const modal = useToggle();

  return (
    <>
      <Button
        i={1}
        s={1}
        disabled={docManagementStore.is === `busy` || docsStore.is === `busy`}
        title="Your documents"
        onClick={modal.open}
      >
        <BiGridAlt />
      </Button>

      {modal.opened && (
        <React.Suspense>
          <DocsListModal onClose={modal.close} />
        </React.Suspense>
      )}
    </>
  );
};

export { YourDocumentsContainer };
