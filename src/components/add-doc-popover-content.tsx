import React, { type FormEventHandler } from 'react';
import { Button } from 'design-system/button';
import { BiPlusCircle, BiX } from 'react-icons/bi';
import Popover from 'design-system/popover';
import { authStoreSelectors } from 'store/auth/auth.store';
import { useDocManagementStore } from 'store/doc-management/doc-management.store';
import { Input } from 'design-system/input';
import { useForm } from 'development-kit/use-form';
import { createDocSchema } from 'core/validators/doc-validators';

interface AddDocPopoverContentProps {
  onClose(): void;
}

const AddDocPopoverContent = ({ onClose }: AddDocPopoverContentProps) => {
  const docManagementStore = useDocManagementStore();
  const [{ invalid, values, untouched }, { inject }] = useForm(
    { name: `` },
    createDocSchema,
  );

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      await authStoreSelectors.authorized().createDoc(values.name);
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
            s={1}
            title="Close document adding"
            className="ml-8"
            disabled={docManagementStore.is === `busy`}
            onClick={onClose}
          >
            <BiX />
          </Button>
        </div>
        <fieldset className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Document name*</label>
          <Input placeholder="Type document name" {...inject(`name`)} />
        </fieldset>
        <Button
          type="submit"
          i={2}
          s={2}
          className="mt-6"
          auto
          title="Confirm document creation"
          disabled={untouched || invalid || docManagementStore.is === `busy`}
        >
          Create
          <BiPlusCircle />
        </Button>
      </form>
    </Popover>
  );
};

export default AddDocPopoverContent;
