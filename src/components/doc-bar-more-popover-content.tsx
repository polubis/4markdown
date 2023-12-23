import { Button } from 'design-system/button';
import Popover from 'design-system/popover';
import Switch from 'design-system/switch';
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
  const [active, setActive] = React.useState(false);

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
      <div className="flex items-center mt-4">
        <Button
          i={2}
          disabled={
            docManagementStore.is === `busy` ||
            authStore.is !== `authorized` ||
            docsStore.is === `busy`
          }
          rfull
          title="Delete current document"
          onClick={onOpen}
        >
          <BiTrash className="text-2xl" />
        </Button>
        <Switch
          className="ml-2"
          title="Change visiblity"
          active={active}
          onChange={() => setActive(!active)}
        />
        <Switch
          className="ml-2"
          active={active}
          title="Change visiblity"
          onChange={() => setActive(!active)}
        />
        <Switch
          className="ml-2"
          active={active}
          disabled
          title="Change visiblity"
          onChange={() => setActive(!active)}
        />
      </div>
    </Popover>
  );
};

export default DocBarMorePopoverContent;
