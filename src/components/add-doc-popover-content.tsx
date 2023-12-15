import Backdrop from 'design-system/backdrop';
import React from 'react';
import c from 'classnames';
import { Button } from 'design-system/button';
import { BiX } from 'react-icons/bi';

const baseClasses = `gap-2 fixed rounded-md p-4 bg-zinc-200 dark:bg-gray-950 shadow-lg z-30`;

interface AddDocPopoverContentProps {
  onClose(): void;
}

const AddDocPopoverContent: React.FC<AddDocPopoverContentProps> = ({
  onClose,
}) => {
  const handleSubmit = (): void => {};

  const Content = (
    <>
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
          className="px-3 py-2 placeholder:text-gray-600 dark:placeholder:text-gray-300 text-sm rounded-md bg-gray-300 dark:bg-slate-800 dark:border-gray-500 border-2 border-gray-600 outline-none"
        />
      </fieldset>

      <Button
        type="submit"
        i={2}
        className="mt-4"
        rfull
        title="Confirm document creation"
      >
        Create
      </Button>
    </>
  );

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className={c(baseClasses, `hidden md:flex flex-col left-4 top-16`)}
      >
        {Content}
      </form>
      <form
        onSubmit={handleSubmit}
        className={c(
          baseClasses,
          `flex flex-col md:hidden left-4 right-4 bottom-16 max-w-max`,
        )}
      >
        {Content}
      </form>
      <Backdrop onClick={onClose} />
    </>
  );
};

export default AddDocPopoverContent;
