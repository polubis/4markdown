import React from 'react';
import { Button } from 'design-system/button';
import { BiX } from 'react-icons/bi';
import Popover from 'design-system/popover';
import { docStoreValidators } from 'store/doc/doc.store';
import { authStoreSelectors } from 'store/auth/auth.store';
import { useDocManagementStore } from 'store/doc-management/doc-management.store';

interface AddDocPopoverContentProps {
  onClose(): void;
}

const AddDocPopoverContent: React.FC<AddDocPopoverContentProps> = ({
  onClose,
}) => {
  const docManagementStore = useDocManagementStore();
  const [name, setName] = React.useState(``);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      await authStoreSelectors.authorized().createDoc(name);
      onClose();
    } catch {}
  };

  return (
    <Popover
      className="bottom-20 left-2 md:bottom-auto md:top-16"
      onBackdropClick={docManagementStore.is === `busy` ? undefined : onClose}
    >
      <form className="max-w-[280px] flex flex-col" onSubmit={handleSubmit}>
        <div className="flex items-center mb-2">
          <h6 className="text-xl">Create Document</h6>
          <Button
            type="button"
            i={2}
            rfull
            className="ml-8"
            disabled={docManagementStore.is === `busy`}
            onClick={onClose}
          >
            <BiX className="text-2xl" />
          </Button>
        </div>
        <fieldset className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Document name*</label>
          <input
            placeholder="Type document name..."
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="px-3 py-2 placeholder:text-gray-600 dark:placeholder:text-gray-300 text-sm rounded-md bg-gray-300 dark:bg-slate-800 border-[2.5px] border-transparent focus:border-black dark:border-white outline-none"
          />
        </fieldset>

        <Button
          type="submit"
          i={2}
          className="mt-6"
          rfull
          title="Confirm document creation"
          disabled={
            docStoreValidators.name(name) || docManagementStore.is === `busy`
          }
        >
          Create
        </Button>
      </form>
    </Popover>
  );
};

export default AddDocPopoverContent;
