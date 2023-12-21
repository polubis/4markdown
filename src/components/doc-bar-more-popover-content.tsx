import { Button } from 'design-system/button';
import Popover from 'design-system/popover';
import React from 'react';
import { BiTrash, BiX } from 'react-icons/bi';
import { useAuthStore } from 'store/auth/auth.store';
import { useDocManagementStore } from 'store/doc-management/doc-management.store';
import { useDocsStore } from 'store/docs/docs.store';

interface DocBarMorePopoverContentProps {
  onClose(): void;
  onOpen(): void;
}

const DocBarMorePopoverContent = ({
  onClose,
  onOpen,
}: DocBarMorePopoverContentProps) => {
  const authStore = useAuthStore();
  const docsStore = useDocsStore();
  const docManagementStore = useDocManagementStore();

  return (
    <Popover
      className="bottom-32 left-2 md:left-32 md:bottom-auto md:top-32"
      onBackdropClick={onClose}
    >
      <div className="flex items-center">
        <h6 className="text-xl">Additional Options</h6>
        <Button
          i={2}
          rfull
          className="ml-8"
          title="Close additional options"
          onClick={onClose}
        >
          <BiX />
        </Button>
      </div>
      <div className="mt-4">
        <Button
          i={2}
          disabled={
            docManagementStore.is === `busy` ||
            authStore.is !== `authorized` ||
            docsStore.is === `busy`
          }
          className="ml-auto"
          rfull
          title="Delete current document"
          onClick={onOpen}
        >
          <BiTrash className="text-2xl" />
        </Button>
      </div>
    </Popover>
  );
};

export default DocBarMorePopoverContent;
