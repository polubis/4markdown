import { Button } from 'design-system/button';
import { useToggle } from 'development-kit/use-toggle';
import React from 'react';
import { BiCheck, BiEdit, BiSave, BiX } from 'react-icons/bi';
import { authStoreSelectors } from 'store/auth/auth.store';
import { useDocManagementStore } from 'store/doc-management/doc-management.store';
import { docStoreSelectors, docStoreValidators } from 'store/doc/doc.store';

const DocBar = () => {
  const docManagementStore = useDocManagementStore();
  const docStore = docStoreSelectors.useActive();
  const [name, setName] = React.useState(docStore.name);
  const edition = useToggle();

  const handleConfirm: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      await authStoreSelectors.authorized().updateDoc(name);
      edition.close();
    } catch {}
  };

  const handleOpen: React.MouseEventHandler<HTMLButtonElement> = () => {
    setName(docStore.name);
    edition.open();
  };

  const handleClose: React.MouseEventHandler<HTMLButtonElement> = () => {
    edition.close();
    setName(``);
  };

  return (
    <div className="flex h-[50px] px-4 py-2 bg-zinc-200 dark:bg-gray-950 border-t-2 md:border-b-2 md:border-t-0 border-zinc-300 dark:border-zinc-800">
      {edition.opened ? (
        <form className="flex items-center" onSubmit={handleConfirm}>
          <input
            className="w-full px-3 py-1 placeholder:text-gray-600 dark:placeholder:text-gray-300 text-sm rounded-md bg-gray-300 dark:bg-slate-800 border-[2.5px] border-transparent focus:border-black dark:border-white outline-none"
            autoFocus
            placeholder="Type document name*"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button
            i={2}
            rfull
            className="mr-2 ml-2"
            disabled={
              docStoreValidators.name(name) || docManagementStore.is === `busy`
            }
            title="Confirm name change"
            type="submit"
          >
            <BiCheck />
          </Button>
          <Button
            i={2}
            rfull
            title="Close edition"
            disabled={docManagementStore.is === `busy`}
            type="button"
            onClick={handleClose}
          >
            <BiX />
          </Button>
        </form>
      ) : (
        <>
          <h6
            className="text-xl font-bold max-w-[260px] truncate"
            title={docStore.name}
          >
            {docStore.name}
          </h6>
          <div className="bg-zinc-300 dark:bg-zinc-800 h-8 w-0.5 mx-4 shrink-0" />
          <Button i={2} rfull title="Change name" onClick={handleOpen}>
            <BiEdit />
          </Button>
          <Button
            i={2}
            disabled={docManagementStore.is === `busy`}
            className="ml-2"
            rfull
            title="Save changes"
          >
            <BiSave />
          </Button>
        </>
      )}
    </div>
  );
};

export default DocBar;
