import React from 'react';
import { Button } from 'design-system/button';
import { BiX } from 'react-icons/bi';
import { docStoreActions, useDocStore } from 'store/doc/doc.store';
import Popover from 'design-system/popover';

interface AddDocPopoverContentProps {
  onClose(): void;
}

const AddDocPopoverContent: React.FC<AddDocPopoverContentProps> = ({
  onClose,
}) => {
  const docStore = useDocStore();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    docStoreActions.create();
    onClose();
  };

  return (
    <Popover
      className="bottom-20 left-2 md:bottom-auto md:top-16"
      onBackdropClick={onClose}
    >
      <form className="max-w-[280px] flex flex-col" onSubmit={handleSubmit}>
        <div className="flex items-center">
          <h6 className="text-xl">Create Document</h6>
          <Button type="button" i={2} rfull className="ml-8" onClick={onClose}>
            <BiX className="text-2xl" />
          </Button>
        </div>
        <fieldset className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Document name*</label>
          <input
            placeholder="Type document name..."
            onChange={(e) => docStoreActions.changeName(e.target.value)}
            value={docStore.name}
            className="px-3 py-2 placeholder:text-gray-600 dark:placeholder:text-gray-300 text-sm rounded-md bg-gray-300 dark:bg-slate-800 dark:border-gray-500 border-2 border-gray-600 outline-none"
          />
        </fieldset>

        <Button
          type="submit"
          i={2}
          className="mt-6"
          rfull
          title="Confirm document creation"
          disabled={docStore.invalid}
        >
          Create
        </Button>
      </form>
    </Popover>
  );
};

export default AddDocPopoverContent;
