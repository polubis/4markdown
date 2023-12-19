import { Button } from 'design-system/button';
import { useToggle } from 'development-kit/use-toggle';
import React from 'react';
import {
  BiCheck,
  BiEdit,
  BiGridAlt,
  BiSave,
  BiTrash,
  BiX,
} from 'react-icons/bi';
import { authStoreSelectors, useAuthStore } from 'store/auth/auth.store';
import { creatorStoreSelectors } from 'store/creator/creator.store';
import { useDocManagementStore } from 'store/doc-management/doc-management.store';
import { docStoreSelectors, docStoreValidators } from 'store/doc/doc.store';
import { useDocsStore } from 'store/docs/docs.store';

const DocsListModal = React.lazy(() => import(`./docs-list-modal`));
const DeleteDocModal = React.lazy(() => import(`./delete-doc-modal`));

const DocBar = () => {
  const docManagementStore = useDocManagementStore();
  const docStore = docStoreSelectors.useActive();
  const docsStore = useDocsStore();
  const authStore = useAuthStore();
  const creatorStore = creatorStoreSelectors.useReady();
  const [name, setName] = React.useState(docStore.name);
  const edition = useToggle();
  const docsModal = useToggle();
  const deleteModal = useToggle();

  const handleNameChangeConfirm: React.FormEventHandler<
    HTMLFormElement
  > = async (e) => {
    e.preventDefault();
    try {
      await authStoreSelectors.authorized().updateDoc(name);
      edition.close();
    } catch {}
  };

  const handleSaveCodeConfirm = async (): Promise<void> => {
    try {
      await authStoreSelectors.authorized().saveDoc();
    } catch {}
  };

  const handleEditOpen: React.MouseEventHandler<HTMLButtonElement> = () => {
    setName(docStore.name);
    edition.open();
  };

  const handleEditClose: React.MouseEventHandler<HTMLButtonElement> = () => {
    edition.close();
    setName(``);
  };

  const unchanged = creatorStore.prevCode === creatorStore.code;

  return (
    <>
      <div className="flex h-[50px] px-4 py-2 bg-zinc-200 dark:bg-gray-950 border-t-2 md:border-b-2 md:border-t-0 border-zinc-300 dark:border-zinc-800">
        {edition.opened ? (
          <form
            className="flex items-center"
            onSubmit={handleNameChangeConfirm}
          >
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
                docStoreValidators.name(name) ||
                docManagementStore.is === `busy`
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
              onClick={handleEditClose}
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
            <Button
              i={2}
              rfull
              title="Change name"
              disabled={authStore.is !== `authorized`}
              onClick={handleEditOpen}
            >
              <BiEdit />
            </Button>
            <Button
              i={2}
              disabled={
                docManagementStore.is === `busy` ||
                unchanged ||
                authStore.is !== `authorized`
              }
              className="ml-2"
              rfull
              title="Save changes"
              onClick={handleSaveCodeConfirm}
            >
              <BiSave />
            </Button>
            <Button
              i={2}
              disabled={
                docManagementStore.is === `busy` ||
                authStore.is !== `authorized` ||
                docsStore.is === `busy`
              }
              className="mx-2"
              rfull
              title="Your documents"
              onClick={docsModal.open}
            >
              <BiGridAlt />
            </Button>
            <Button
              i={2}
              disabled={
                docManagementStore.is === `busy` ||
                authStore.is !== `authorized` ||
                docsStore.is === `busy`
              }
              className="ml-auto"
              rfull
              title="Delete this document"
              onClick={deleteModal.open}
            >
              <BiTrash />
            </Button>
          </>
        )}
      </div>

      {docsModal.opened && (
        <React.Suspense>
          <DocsListModal onClose={docsModal.close} />
        </React.Suspense>
      )}

      {deleteModal.opened && (
        <React.Suspense>
          <DeleteDocModal onClose={deleteModal.close} />
        </React.Suspense>
      )}
    </>
  );
};

export default DocBar;
