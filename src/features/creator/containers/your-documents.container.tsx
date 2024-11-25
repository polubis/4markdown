import React from 'react';
import { Button } from 'design-system/button';
import { BiGridAlt } from 'react-icons/bi';
import { useToggle } from 'development-kit/use-toggle';
import { useDocumentsCreatorState } from 'store/documents-creator';

const DocsListModal = React.lazy(
  () => import(`../../../components/docs-list-modal`),
);

const YourDocumentsContainer = () => {
  const { busy } = useDocumentsCreatorState();
  const modal = useToggle();

  return (
    <>
      <Button
        i={1}
        s={1}
        disabled={busy}
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
