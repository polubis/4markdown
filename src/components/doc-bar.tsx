import { Button } from 'design-system/button';
import { useToggle } from 'development-kit/use-toggle';
import React from 'react';
import { BiCheck, BiEdit, BiSave, BiX } from 'react-icons/bi';
import {
  docStoreActions,
  docStoreValidators,
  useDocStore,
} from 'store/doc/doc.store';

const DocBar = () => {
  const docStore = useDocStore();
  const [name, setName] = React.useState(docStore.name);
  const edition = useToggle();

  const handleConfirm: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    docStoreActions.changeName(name);
    edition.close();
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
            className="w-full px-3 py-1 placeholder:text-gray-600 dark:placeholder:text-gray-300 text-sm rounded-md bg-gray-300 dark:bg-slate-800 dark:border-gray-500 border-2 border-gray-600 outline-none"
            autoFocus
            placeholder="Type Document Name*"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button
            i={2}
            rfull
            className="mr-2 ml-2"
            disabled={docStoreValidators.name(name)}
            title="Confirm name change"
            type="submit"
          >
            <BiCheck />
          </Button>
          <Button
            i={2}
            rfull
            title="Close edition"
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
          <Button i={2} className="ml-2" rfull title="Save changes">
            <BiSave />
          </Button>
        </>
      )}
    </div>
  );
};

export default DocBar;
